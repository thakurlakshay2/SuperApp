"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Trash2 } from "lucide-react";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Button = ({ className, variant = "default", ...props }) => {
  return (
    <button
      className={cn(
        "px-4 py-2 rounded-lg font-semibold transition",
        variant === "default" ? "bg-blue-500 text-white hover:bg-blue-600" : "",
        variant === "ghost"
          ? "bg-transparent text-gray-700 hover:bg-gray-100"
          : "",
        className
      )}
      {...props}
    />
  );
};

const Card = ({ className, ...props }) => {
  return (
    <div
      className={cn(
        "rounded-xl shadow-md bg-white p-4 border border-gray-200",
        className
      )}
      {...props}
    />
  );
};

const initialGroups = [
  {
    id: 1,
    name: "Trip to Goa",
    transactions: [
      { id: 1, name: "Alice", amount: 120, type: "sent" },
      { id: 2, name: "Bob", amount: 75, type: "received" },
    ],
  },
  {
    id: 2,
    name: "Office Lunch",
    transactions: [{ id: 3, name: "Charlie", amount: 200, type: "sent" }],
  },
];

export default function Page() {
  const [groups, setGroups] = useState(initialGroups);

  const addTransaction = (groupId) => {
    const name = prompt("Enter name:");
    const amount = parseFloat(prompt("Enter amount:"));
    const type = prompt("Enter type (sent/received):");

    if (name && !isNaN(amount) && (type === "sent" || type === "received")) {
      setGroups((prev) =>
        prev.map((group) =>
          group.id === groupId
            ? {
                ...group,
                transactions: [
                  ...group.transactions,
                  { id: Date.now(), name, amount, type },
                ],
              }
            : group
        )
      );
    }
  };

  const removeTransaction = (groupId, txnId) => {
    setGroups((prev) =>
      prev.map((group) =>
        group.id === groupId
          ? {
              ...group,
              transactions: group.transactions.filter(
                (txn) => txn.id !== txnId
              ),
            }
          : group
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 flex flex-col items-center p-6">
      <motion.h1
        className="text-3xl font-bold text-blue-600 mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        PayurFren
      </motion.h1>

      {groups.map((group) => (
        <div key={group.id} className="w-full max-w-md mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-3">
            {group.name}
          </h2>
          <div className="space-y-4">
            {group.transactions.map((txn) => (
              <motion.div
                key={txn.id}
                initial={{ opacity: 0, x: txn.type === "sent" ? -50 : 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="p-4 flex items-center justify-between rounded-xl shadow-md bg-white">
                  <span className="text-lg font-semibold">{txn.name}</span>
                  <div
                    className={`flex items-center space-x-2 ${
                      txn.type === "sent" ? "text-red-500" : "text-green-500"
                    }`}
                  >
                    {txn.type === "sent" ? "-" : "+"}${txn.amount}
                    <ArrowRight className="w-5 h-5" />
                  </div>
                  <Button
                    className="ml-4 p-1 text-red-500 hover:text-red-700"
                    variant="ghost"
                    onClick={() => removeTransaction(group.id, txn.id)}
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
          <Button
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg shadow"
            onClick={() => addTransaction(group.id)}
          >
            Add Expense
          </Button>
        </div>
      ))}
    </div>
  );
}
