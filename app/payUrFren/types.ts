export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
}

export interface Group {
  id: string | number;
  name: string;
  description?: string;
  members: User[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  currency: string;
  themeColor: string;
  expenses?: Expense[];
}

export interface Expense {
  id: string;
  groupId: string;
  description: string;
  amount: number;
  paidBy: string;
  date: Date;
  category: ExpenseCategory;
  splitType: SplitType;
  splits: ExpenseSplit[];
  attachments?: string[];
  notes?: string;
}

export interface ExpenseSplit {
  userId: string;
  amount: number;
  percentage?: number;
}

export enum ExpenseCategory {
  Food = "Food",
  Travel = "Travel",
  Shopping = "Shopping",
  Entertainment = "Entertainment",
  Utilities = "Utilities",
  Housing = "Housing",
  Transportation = "Transportation",
  Healthcare = "Healthcare",
  Education = "Education",
  Other = "Other",
}

export enum SplitType {
  Equal = "Equal",
  Percentage = "Percentage",
  Custom = "Custom",
}

export interface Balance {
  userId: string;
  amount: number;
  currency: string;
}

export interface GroupSummary {
  totalExpenses: number;
  averageExpense: number;
  categoryBreakdown: Record<ExpenseCategory, number>;
  memberBalances: Balance[];
  recentActivity: Expense[];
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  message: string;
  read: boolean;
  createdAt: Date;
  metadata?: Record<string, any>;
}

export enum NotificationType {
  ExpenseAdded = "ExpenseAdded",
  ExpenseUpdated = "ExpenseUpdated",
  ExpenseDeleted = "ExpenseDeleted",
  GroupInvite = "GroupInvite",
  PaymentReceived = "PaymentReceived",
  PaymentSent = "PaymentSent",
  GroupActivity = "GroupActivity",
}

export interface Activity {
  id: string;
  type: ActivityType;
  userId: string;
  groupId: string;
  description: string;
  createdAt: Date;
  metadata?: Record<string, any>;
}

export enum ActivityType {
  ExpenseCreated = "ExpenseCreated",
  ExpenseUpdated = "ExpenseUpdated",
  ExpenseDeleted = "ExpenseDeleted",
  MemberAdded = "MemberAdded",
  MemberRemoved = "MemberRemoved",
  GroupUpdated = "GroupUpdated",
  PaymentMade = "PaymentMade",
  PaymentReceived = "PaymentReceived",
}
