"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import TotalBalance from "@/components/TotalBalance";
import GroupList from "@/components/GroupedList";
import AddTransactionModal from "@/components/AddTransactionModal";
import { Button } from "@/components/Button";
// import Button from "@/components/Button";

const initialGroups = [
  {
    id: 1,
    name: "Trip to Goa",
    createdAt: "2024-03-01",
    members: ["Alice", "Bob", "Charlie"],
    transactions: [
      {
        id: 1,
        name: "Alice",
        amount: 120,
        type: "sent",
        currency: "USD",
        timestamp: "10:30 AM",
      },
      {
        id: 2,
        name: "Bob",
        amount: 75,
        type: "received",
        currency: "USD",
        timestamp: "11:00 AM",
      },
    ],
  },
  {
    id: 2,
    name: "Office Lunch",
    createdAt: "2024-03-05",
    members: ["Charlie", "David"],
    transactions: [
      {
        id: 3,
        name: "Charlie",
        amount: 200,
        type: "sent",
        currency: "USD",
        timestamp: "1:00 PM",
      },
    ],
  },
];

export default function Page() {
  const [groups, setGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setGroups(initialGroups);
      setIsLoading(false);
    }, 2000);
  }, []);

  const addTransaction = (groupId, transaction) => {
    setGroups((prev) =>
      prev.map((group) =>
        group.id === groupId
          ? { ...group, transactions: [...group.transactions, transaction] }
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

      <TotalBalance groups={groups} isLoading={isLoading} />
      <GroupList groups={groups} isLoading={isLoading} />

      <Button
        className="fixed bottom-6 right-6 bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-lg"
        onClick={() => setIsModalOpen(true)}
      >
        <Plus className="w-6 h-6" />
      </Button>

      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddTransaction={addTransaction}
        groups={groups}
      />
    </div>
  );
}
