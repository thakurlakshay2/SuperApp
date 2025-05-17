import React from "react";
import { User, Expense } from "../../app/payUrFren/types";
import { Clock, DollarSign, Users, FileText } from "lucide-react";

interface ActivityFeedProps {
  currentUser: User;
  groupMembers: User[];
  expenses: Expense[];
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({
  currentUser,
  groupMembers,
  expenses,
}) => {
  // Format date to relative time (e.g., "2 hours ago")
  const formatRelativeTime = (date: Date): string => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return date.toLocaleDateString();
  };

  // Get user name or "You" if it's the current user
  const getUserDisplayName = (userId: string): string => {
    if (userId === currentUser.id) return "You";
    const user = groupMembers.find((m) => m.id === userId);
    return user?.name || "Unknown";
  };

  // Format amount with currency symbol
  const formatAmount = (amount: number): string => {
    return `$${amount.toFixed(2)}`;
  };

  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "FOOD":
        return "🍽️";
      case "TRANSPORT":
        return "🚗";
      case "ENTERTAINMENT":
        return "🎮";
      case "SHOPPING":
        return "🛍️";
      case "TRAVEL":
        return "✈️";
      case "UTILITIES":
        return "💡";
      case "OTHER":
        return "📝";
      default:
        return "💰";
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>

      <div className="space-y-4">
        {expenses
          .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          )
          .slice(0, 10)
          .map((expense, index) => (
            <div
              key={expense.id}
              className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                <span className="text-lg">
                  {getCategoryIcon(expense.category)}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900 truncate">
                    {expense.description}
                  </h3>
                  <span className="text-sm text-gray-500">
                    {formatRelativeTime(new Date(expense.date))}
                  </span>
                </div>

                <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <DollarSign className="w-4 h-4 mr-1" />
                    <span>{formatAmount(expense.amount)}</span>
                  </div>

                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    <span>Paid by {getUserDisplayName(expense.paidBy)}</span>
                  </div>

                  {expense.notes && (
                    <div className="flex items-center">
                      <FileText className="w-4 h-4 mr-1" />
                      <span className="truncate">{expense.notes}</span>
                    </div>
                  )}
                </div>

                <div className="mt-2 flex flex-wrap gap-2">
                  {expense.splits.map((split, splitIndex) => (
                    <span
                      key={splitIndex}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                    >
                      {getUserDisplayName(split.userId)}:{" "}
                      {formatAmount(split.amount)}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ActivityFeed;
