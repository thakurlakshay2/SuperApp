import {
  Group,
  Expense,
  Balance,
  ExpenseSplit,
  SplitType,
  GroupSummary,
  Activity,
} from "./types";

export const formatCurrency = (
  amount: number,
  currency: string = "INR"
): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency,
  }).format(amount);
};

export const calculateBalances = (expenses: Expense[]): Balance[] => {
  const balances: Record<string, number> = {};

  expenses.forEach((expense) => {
    // Add to the payer's balance
    if (!balances[expense.paidBy]) {
      balances[expense.paidBy] = 0;
    }
    balances[expense.paidBy] += expense.amount;

    // Subtract from each participant's balance
    expense.splits.forEach((split) => {
      if (!balances[split.userId]) {
        balances[split.userId] = 0;
      }
      balances[split.userId] -= split.amount;
    });
  });

  return Object.entries(balances).map(([userId, amount]) => ({
    userId,
    amount,
    currency: "INR",
  }));
};

export const calculateSplits = (
  amount: number,
  participants: string[],
  splitType: SplitType,
  customSplits?: Record<string, number>
): ExpenseSplit[] => {
  switch (splitType) {
    case SplitType.Equal:
      const equalAmount = amount / participants.length;
      return participants.map((userId) => ({
        userId,
        amount: equalAmount,
      }));

    case SplitType.Percentage:
      if (!customSplits) {
        throw new Error("Custom splits required for percentage split");
      }
      return Object.entries(customSplits).map(([userId, percentage]) => ({
        userId,
        amount: (amount * percentage) / 100,
        percentage,
      }));

    case SplitType.Custom:
      if (!customSplits) {
        throw new Error("Custom splits required for custom split");
      }
      return Object.entries(customSplits).map(([userId, amount]) => ({
        userId,
        amount,
      }));

    default:
      throw new Error("Invalid split type");
  }
};

export const getGroupSummary = (
  group: Group,
  expenses: Expense[]
): GroupSummary => {
  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );
  const averageExpense = totalExpenses / expenses.length || 0;

  const categoryBreakdown = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const memberBalances = calculateBalances(expenses);
  const recentActivity = expenses
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 5);

  return {
    totalExpenses,
    averageExpense,
    categoryBreakdown,
    memberBalances,
    recentActivity,
  };
};

export const generateActivityMessage = (activity: Activity): string => {
  switch (activity.type) {
    case "ExpenseCreated":
      return `${activity.userId} added a new expense`;
    case "ExpenseUpdated":
      return `${activity.userId} updated an expense`;
    case "ExpenseDeleted":
      return `${activity.userId} deleted an expense`;
    case "MemberAdded":
      return `${activity.userId} added a new member`;
    case "MemberRemoved":
      return `${activity.userId} removed a member`;
    case "GroupUpdated":
      return `${activity.userId} updated group details`;
    case "PaymentMade":
      return `${activity.userId} made a payment`;
    case "PaymentReceived":
      return `${activity.userId} received a payment`;
    default:
      return "New activity in the group";
  }
};

export const validateExpense = (expense: Partial<Expense>): string[] => {
  const errors: string[] = [];

  if (!expense.description) {
    errors.push("Description is required");
  }
  if (!expense.amount || expense.amount <= 0) {
    errors.push("Amount must be greater than 0");
  }
  if (!expense.paidBy) {
    errors.push("Payer is required");
  }
  if (!expense.splits || expense.splits.length === 0) {
    errors.push("At least one split is required");
  }
  if (expense.splits) {
    const totalSplit = expense.splits.reduce(
      (sum, split) => sum + split.amount,
      0
    );
    if (Math.abs(totalSplit - (expense.amount || 0)) > 0.01) {
      errors.push("Total splits must equal the expense amount");
    }
  }

  return errors;
};
