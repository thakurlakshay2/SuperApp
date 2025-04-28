import { Group, Expense, User, Balance } from "@/app/payUrFren/types";

export function formatCurrency(
  amount: number,
  currency: string = "INR"
): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function calculateMemberBalances(
  group: Group,
  currentUser: User
): Record<string, Balance> {
  const balances: Record<string, Balance> = {};

  // Initialize balances for all members
  group.members.forEach((member) => {
    balances[member.id] = {
      userId: member.id,
      amount: 0,
      currency: group.currency,
    };
  });

  // Calculate balances based on expenses
  group.expenses?.forEach((expense) => {
    const paidBy = expense.paidBy;
    const totalAmount = expense.amount;

    // Add the full amount to the payer's balance
    balances[paidBy].amount += totalAmount;

    // Subtract each member's share from their balance
    expense.splits.forEach((split) => {
      balances[split.userId].amount -= split.amount;
    });
  });

  return balances;
}

export function calculateSettlements(balances: Record<string, Balance>): {
  from: string;
  to: string;
  amount: number;
}[] {
  const settlements: { from: string; to: string; amount: number }[] = [];
  const positiveBalances: { userId: string; amount: number }[] = [];
  const negativeBalances: { userId: string; amount: number }[] = [];

  // Separate positive and negative balances
  Object.entries(balances).forEach(([userId, balance]) => {
    if (balance.amount > 0) {
      positiveBalances.push({ userId, amount: balance.amount });
    } else if (balance.amount < 0) {
      negativeBalances.push({ userId, amount: Math.abs(balance.amount) });
    }
  });

  // Sort balances in descending order
  positiveBalances.sort((a, b) => b.amount - a.amount);
  negativeBalances.sort((a, b) => b.amount - a.amount);

  // Calculate settlements
  let i = 0;
  let j = 0;

  while (i < positiveBalances.length && j < negativeBalances.length) {
    const positive = positiveBalances[i];
    const negative = negativeBalances[j];
    const amount = Math.min(positive.amount, negative.amount);

    settlements.push({
      from: negative.userId,
      to: positive.userId,
      amount,
    });

    positive.amount -= amount;
    negative.amount -= amount;

    if (positive.amount === 0) i++;
    if (negative.amount === 0) j++;
  }

  return settlements;
}

export function calculateGroupSummary(group: Group): {
  totalExpenses: number;
  averageExpense: number;
  categoryBreakdown: Record<string, number>;
} {
  const totalExpenses =
    group.expenses?.reduce((sum, expense) => sum + expense.amount, 0) || 0;
  const averageExpense = group.expenses?.length
    ? totalExpenses / group.expenses.length
    : 0;

  const categoryBreakdown: Record<string, number> = {};
  group.expenses?.forEach((expense) => {
    const category = expense.category;
    categoryBreakdown[category] =
      (categoryBreakdown[category] || 0) + expense.amount;
  });

  return {
    totalExpenses,
    averageExpense,
    categoryBreakdown,
  };
}

export function calculateUserShare(expense: Expense, userId: string): number {
  const userSplit = expense.splits.find((split) => split.userId === userId);
  return userSplit?.amount || 0;
}

export function calculateTotalOwed(group: Group, userId: string): number {
  return (
    group.expenses?.reduce((total, expense) => {
      if (expense.paidBy === userId) {
        // User paid for this expense
        return total + expense.amount;
      } else {
        // User owes their share
        const userSplit = expense.splits.find(
          (split) => split.userId === userId
        );
        return total - (userSplit?.amount || 0);
      }
    }, 0) || 0
  );
}
