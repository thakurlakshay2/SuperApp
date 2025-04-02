"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, UserPlus, X } from "lucide-react";

const LOCAL_STORAGE_KEY = "payurfren_groups";

// 📌 Dummy Data (only used if no data exists)
const DUMMY_DATA = {
  "1": {
    id: "1",
    name: "Trip to Goa",
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
      {
        id: 3,
        name: "Charlie",
        amount: 50,
        type: "sent",
        currency: "USD",
        timestamp: "12:15 PM",
      },
    ],
    createdAt: "March 20, 2025",
  },
};

export default function GroupPage() {
  const router = useRouter();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isTxnModalOpen, setTxnModalOpen] = useState(false);
  const [isMemberModalOpen, setMemberModalOpen] = useState(false);
  const [txnForm, setTxnForm] = useState({
    name: "",
    amount: "",
    type: "sent",
    currency: "USD",
  });
  const [newMember, setNewMember] = useState("");

  useEffect(() => {
    const id = window.location.pathname.split("/").pop();

    // ✅ Load from localStorage (or set dummy data if empty)
    let storedGroups = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
    if (!storedGroups) {
      storedGroups = DUMMY_DATA;
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(storedGroups));
    }

    if (id && storedGroups[id]) {
      setGroup(storedGroups[id]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (group) {
      const storedGroups =
        JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || {};
      storedGroups[group.id] = group;
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(storedGroups));
    }
  }, [group]);

  if (loading) return <p className="text-center p-6">Loading group data...</p>;
  if (!group)
    return <p className="text-center p-6 text-red-500">Group not found</p>;

  const totalBalance = group.transactions.reduce(
    (acc, txn) => (txn.type === "sent" ? acc - txn.amount : acc + txn.amount),
    0
  );

  const handleAddTransaction = () => {
    const newTransaction = {
      id: Date.now(),
      ...txnForm,
      amount: Number(txnForm.amount),
      timestamp: new Date().toLocaleTimeString(),
    };
    setGroup((prev) => ({
      ...prev,
      transactions: [...prev.transactions, newTransaction],
    }));
    setTxnModalOpen(false);
    setTxnForm({ name: "", amount: "", type: "sent", currency: "USD" });
  };

  const handleAddMember = () => {
    if (newMember.trim()) {
      setGroup((prev) => ({
        ...prev,
        members: [...prev.members, newMember.trim()],
      }));
      setNewMember("");
      setMemberModalOpen(false);
    }
  };

  return (
    <motion.div
      className="min-h-screen p-6 bg-gray-100 text-gray-800"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-indigo-600">{group.name}</h1>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 shadow-md"
          onClick={() => setTxnModalOpen(true)}
        >
          <Plus className="w-5 h-5" />
          Add Transaction
        </button>
      </div>

      {/* Group Details */}
      <div className="bg-white p-4 rounded-md shadow-md mb-6">
        <p className="text-gray-500">Created on: {group.createdAt}</p>
        <p className="font-semibold text-lg mt-2">
          Total Balance:{" "}
          <span
            className={totalBalance >= 0 ? "text-green-500" : "text-red-500"}
          >
            {totalBalance >= 0 ? "+" : "-"}${Math.abs(totalBalance)}
          </span>
        </p>
      </div>

      {/* Members List */}
      <div className="bg-white p-4 rounded-md shadow-md mb-6">
        <h2 className="text-lg font-semibold mb-2">Group Members</h2>
        <ul className="flex flex-wrap gap-2">
          {group.members.map((member, index) => (
            <motion.li
              key={index}
              className="bg-indigo-100 px-3 py-1 rounded-md text-indigo-700"
              whileHover={{ scale: 1.1 }}
            >
              {member}
            </motion.li>
          ))}
        </ul>
      </div>

      {/* Transactions List */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Transactions</h2>
        {group.transactions.map((txn) => (
          <motion.div
            key={txn.id}
            className="p-4 bg-white rounded-md shadow-md flex justify-between items-center"
            whileHover={{ scale: 1.02 }}
          >
            <span className="text-gray-600">{txn.timestamp}</span>
            <span className="font-semibold">{txn.name}</span>
            <span className="text-gray-500">{txn.currency}</span>
            <span
              className={`font-semibold ${
                txn.type === "sent" ? "text-red-500" : "text-green-500"
              }`}
            >
              {txn.type === "sent" ? "-" : "+"}${txn.amount}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Add Member Button */}
      <button
        className="fixed bottom-6 right-6 bg-indigo-500 hover:bg-indigo-600 text-white p-4 rounded-full shadow-lg flex items-center gap-2"
        onClick={() => setMemberModalOpen(true)}
      >
        <UserPlus className="w-6 h-6" />
        Add Member
      </button>

      {/* Add Transaction Modal */}
      {isTxnModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-96">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Add Transaction</h2>
              <X
                className="cursor-pointer"
                onClick={() => setTxnModalOpen(false)}
              />
            </div>
            <input
              type="text"
              placeholder="Name"
              value={txnForm.name}
              onChange={(e) => setTxnForm({ ...txnForm, name: e.target.value })}
              className="w-full p-2 border rounded-md mb-2"
            />
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md w-full"
              onClick={handleAddTransaction}
            >
              Add
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
