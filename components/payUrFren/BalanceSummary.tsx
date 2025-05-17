import React from "react";
import { User, Expense } from "../../app/payUrFren/types";
import { ArrowRight, ArrowLeft } from "lucide-react";

interface BalanceSummaryProps {
  currentUser: User;
  groupMembers: User[];
  expenses: Expense[];
}

interface Balance {
  userId: string;
  amount: number;
}

const BalanceSummary: React.FC<BalanceSummaryProps> = ({
  currentUser,
  groupMembers,
  expenses,
}) => {
  // Calculate balances for each user
  const calculateBalances = (): Balance[] => {
    const balances: { [key: string]: number } = {};

    // Initialize balances for all members
    groupMembers.forEach((member) => {
      balances[member.id] = 0;
    });

    // Calculate net balance for each user
    expenses.forEach((expense) => {
      // Add amount to the person who paid
      balances[expense.paidBy] += expense.amount;

      // Subtract each person's share
      expense.splits.forEach((split) => {
        balances[split.userId] -= split.amount;
      });
    });

    // Convert to array and sort by amount
    return Object.entries(balances)
      .map(([userId, amount]) => ({ userId, amount }))
      .sort((a, b) => b.amount - a.amount);
  };

  // Calculate who owes whom
  const calculateSettlements = () => {
    const balances = calculateBalances();
    const settlements: { from: string; to: string; amount: number }[] = [];

    let i = 0;
    let j = balances.length - 1;

    while (i < j) {
      const debtor = balances[j];
      const creditor = balances[i];

      if (Math.abs(debtor.amount) < 0.01) {
        j--;
        continue;
      }

      if (Math.abs(creditor.amount) < 0.01) {
        i++;
        continue;
      }

      const amount = Math.min(Math.abs(debtor.amount), creditor.amount);
      settlements.push({
        from: debtor.userId,
        to: creditor.userId,
        amount,
      });

      balances[i].amount -= amount;
      balances[j].amount += amount;
    }

    return settlements;
  };

  const settlements = calculateSettlements();

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Balance Summary</h2>

      {settlements.length === 0 ? (
        <p className="text-gray-500 text-center py-4">All settled up! 🎉</p>
      ) : (
        <div className="space-y-4">
          {settlements.map((settlement, index) => {
            const fromUser = groupMembers.find((m) => m.id === settlement.from);
            const toUser = groupMembers.find((m) => m.id === settlement.to);

            if (!fromUser || !toUser) return null;

            const isCurrentUserInvolved =
              fromUser.id === currentUser.id || toUser.id === currentUser.id;

            return (
              <div
                key={index}
                className={`flex items-center justify-between p-4 rounded-lg ${
                  isCurrentUserInvolved ? "bg-blue-50" : "bg-gray-50"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span className="font-medium">
                    {fromUser.id === currentUser.id ? "You" : fromUser.name}
                  </span>
                  <ArrowRight className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">
                    {toUser.id === currentUser.id ? "You" : toUser.name}
                  </span>
                </div>
                <span
                  className={`font-semibold ${
                    isCurrentUserInvolved ? "text-blue-600" : "text-gray-700"
                  }`}
                >
                  ${settlement.amount.toFixed(2)}
                </span>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-gray-200">
        <h3 className="text-sm font-medium text-gray-500 mb-2">
          Your Net Balance
        </h3>
        <div className="flex items-center justify-between">
          <span className="text-gray-700">Total</span>
          <span
            className={`text-lg font-semibold ${
              calculateBalances().find((b) => b.userId === currentUser.id)
                ?.amount || 0 > 0
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            $
            {Math.abs(
              calculateBalances().find((b) => b.userId === currentUser.id)
                ?.amount || 0
            ).toFixed(2)}
          </span>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          {calculateBalances().find((b) => b.userId === currentUser.id)
            ?.amount || 0 > 0
            ? "You are owed money"
            : "You owe money"}
        </p>
      </div>
    </div>
  );
};

export default BalanceSummary;
