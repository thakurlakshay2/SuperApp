import React from "react";

interface TotalBalanceProps {
  groups: any[];
  isLoading: boolean;
}

export default function TotalBalance({ groups, isLoading }: TotalBalanceProps) {
  if (isLoading)
    return (
      <div className="animate-pulse w-full h-12 bg-gray-300 rounded-md"></div>
    );

  const totalBalance = groups.reduce((acc, group) => {
    return (
      acc +
      group.transactions.reduce(
        (sum, txn) => sum + (txn.type === "sent" ? txn.amount : -txn.amount),
        0
      )
    );
  }, 0);

  return (
    <div className="w-full max-w-md p-4 bg-white rounded-lg shadow-md  flex justify-between items-center">
      <span className="text-lg font-semibold text-gray-800">
        Total Balance:
      </span>
      <span
        className={`text-lg font-bold ${
          totalBalance < 0 ? "text-red-500" : "text-green-500"
        }`}
      >
        ${totalBalance.toFixed(2)}
      </span>
    </div>
  );
}
