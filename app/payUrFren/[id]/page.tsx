"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  UserPlus,
  X,
  Camera,
  DollarSign,
  Users,
  Receipt,
  PieChart,
  ArrowLeft,
  Mail,
  Phone,
  Share2,
} from "lucide-react";
import Image from "next/image";
import {
  formatCurrency,
  calculateMemberBalances,
  calculateSettlements,
  calculateGroupSummary,
  calculateTotalOwed,
} from "@/app/utils/calculations";
import {
  Balance,
  ExpenseCategory,
  Group,
  SplitType,
  User,
  Expense,
  ExpenseSplit,
} from "../types";
import { mockGroups } from "../mockData";

// Local storage key
const LOCAL_STORAGE_KEY = "payurfren_groups";

// Add animation variants at the top of the file
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

interface ExpenseFormData {
  description: string;
  amount: number;
  paidBy: string;
  category: ExpenseCategory;
  splitType: SplitType;
  splits: ExpenseSplit[];
  notes?: string;
}

export default function GroupPage() {
  const router = useRouter();
  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("transactions");
  const [isTxnModalOpen, setTxnModalOpen] = useState(false);
  const [isMemberModalOpen, setMemberModalOpen] = useState(false);
  const [isSettleModalOpen, setSettleModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [memberBalances, setMemberBalances] = useState<Record<string, Balance>>(
    {}
  );
  const [currentUser] = useState("1"); // This would come from auth context in real app

  useEffect(() => {
    const id = window.location.pathname.split("/").pop();

    setGroup(mockGroups?.[Number(id) - 1]);
    console.log(id);
  }, [group]);
  const [txnForm, setTxnForm] = useState({
    paidBy: currentUser,
    amount: "",
    description: "",
    category: ExpenseCategory.Food,
    date: new Date().toISOString().split("T")[0],
    splitType: SplitType.Equal,
    splits: [],
    notes: "",
  });

  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [showAddExpense, setShowAddExpense] = useState(false);

  const categories = [
    { id: ExpenseCategory.Food, name: "Food & Drinks", icon: "🍕" },
    { id: ExpenseCategory.Travel, name: "Travel", icon: "✈️" },
    { id: ExpenseCategory.Shopping, name: "Shopping", icon: "🛍️" },
    { id: ExpenseCategory.Entertainment, name: "Entertainment", icon: "🎭" },
    { id: ExpenseCategory.Utilities, name: "Utilities", icon: "💡" },
    { id: ExpenseCategory.Other, name: "Other", icon: "📌" },
  ];

  useEffect(() => {
    const id = window.location.pathname.split("/").pop();

    // Load from localStorage
    const storedGroups =
      JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || {};
    console.log(storedGroups);
    console.log(LOCAL_STORAGE_KEY);
    console.log(id);
    console.log(storedGroups[id]);
    if (id && storedGroups[id]) {
      setGroup(storedGroups[id]);

      // Initialize selected participants in transaction form
      setTxnForm((prev) => ({
        ...prev,
        participants: storedGroups[id].members.map((member) => ({
          name: member,
          included: true,
          customAmount: null,
        })),
      }));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (group) {
      // Update local storage whenever group data changes
      const storedGroups =
        JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || {};
      storedGroups[group?.id] = group;
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(storedGroups));

      // Calculate member balances
      const balances = calculateMemberBalances(group, {
        id: currentUser,
        name: "",
        email: "",
      });
      setMemberBalances(balances);
    }
  }, [group, currentUser]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          className="w-16 h-16 border-t-4 border-indigo-600 border-solid rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        ></motion.div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", damping: 10 }}
        >
          <div className="text-red-500 text-9xl">😕</div>
        </motion.div>
        <p className="text-xl text-red-500">Group not found</p>
        <button
          onClick={() => router.push("/payUrFren")}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md mt-4 hover:bg-indigo-700 transition-colors"
        >
          Go back to groups
        </button>
      </div>
    );
  }

  const totalBalance = group?.expenses?.reduce(
    (acc, txn) =>
      txn.paidBy === currentUser
        ? acc + txn.amount
        : acc - txn.amount / txn.splits.length,
    0
  );

  const handleAddTransaction = () => {
    if (!group) return;

    const newTransaction: Expense = {
      id: String(Date.now()),
      groupId: String(group?.id),
      description: txnForm.description,
      amount: Number(txnForm.amount),
      paidBy: txnForm.paidBy,
      date: new Date(txnForm.date),
      category: txnForm.category,
      splitType: txnForm.splitType,
      splits: group?.members.map((member) => ({
        userId: member.id,
        amount: Number(txnForm.amount) / group?.members.length,
      })),
      notes: txnForm.notes,
    };

    setGroup((prev) =>
      prev
        ? {
            ...prev,
            expenses: [...(prev.expenses || []), newTransaction],
          }
        : null
    );
    setTxnModalOpen(false);
  };

  const handleAddMember = () => {
    if (!group || !newMember.name.trim()) return;

    const newUser: User = {
      id: String(Date.now()),
      name: newMember.name.trim(),
      email: newMember.email,
      phone: newMember.phone,
    };

    setGroup((prev) =>
      prev
        ? {
            ...prev,
            members: [...prev.members, newUser],
          }
        : null
    );

    setNewMember({ name: "", email: "", phone: "" });
    setMemberModalOpen(false);
  };

  const handleSettleDebt = () => {
    if (!selectedMember || !group) return;

    const amount = memberBalances[selectedMember]?.amount || 0;
    const settlementTransaction: Expense = {
      id: String(Date.now()),
      groupId: String(group?.id),
      description: `Settlement payment`,
      amount: Math.abs(amount),
      paidBy: amount < 0 ? currentUser : selectedMember,
      date: new Date(),
      category: ExpenseCategory.Other,
      splitType: SplitType.Equal,
      splits: [
        { userId: currentUser, amount: Math.abs(amount) / 2 },
        { userId: selectedMember, amount: Math.abs(amount) / 2 },
      ],
      notes: "Settlement payment",
    };

    setGroup((prev) =>
      prev
        ? {
            ...prev,
            expenses: [...(prev.expenses || []), settlementTransaction],
          }
        : null
    );

    setSettleModalOpen(false);
    setSelectedMember(null);
  };

  const groupSummary = group ? calculateGroupSummary(group) : null;
  const totalOwed = group ? calculateTotalOwed(group, currentUser) : 0;

  const handleAddExpense = (data: ExpenseFormData) => {
    const newExpense: Expense = {
      id: `exp-${Date.now()}`,
      groupId: group?.id.toString(),
      description: data.description,
      amount: data.amount,
      paidBy: data.paidBy,
      date: new Date(),
      category: data.category,
      splitType: data.splitType,
      splits: data.splits,
      attachments: [],
      notes: data.notes || "",
    };

    setGroup((prev) => ({
      ...prev,
      expenses: [...prev.expenses, newExpense],
    }));
    setShowAddExpense(false);
  };

  const calculateUserBalance = (userId: string) => {
    return group?.expenses?.reduce((acc, txn) => {
      if (txn.paidBy === userId) {
        return acc + txn.amount;
      }
      const userSplit = txn.splits.find((split) => split.userId === userId);
      if (userSplit) {
        return acc - userSplit.amount;
      }
      return acc;
    }, 0);
  };

  // Calculate total amount owed by each user
  const calculateOwedAmounts = () => {
    const owedAmounts = new Map<string, number>();

    group?.expenses.forEach((expense) => {
      // Add the full amount to what the payer is owed
      owedAmounts.set(
        expense.paidBy,
        (owedAmounts.get(expense.paidBy) || 0) + expense.amount
      );

      // Subtract each person's split amount from what they owe
      expense.splits.forEach((split) => {
        owedAmounts.set(
          split.userId,
          (owedAmounts.get(split.userId) || 0) - split.amount
        );
      });
    });

    return owedAmounts;
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-b from-indigo-50 to-white text-gray-800"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="sticky top-0 bg-white shadow-md z-10">
        <div className="max-w-4xl mx-auto p-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/groups")}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <ArrowLeft className="w-5 h-5" />
            </motion.button>
            <h1 className="text-2xl font-bold text-indigo-600">
              {group?.name}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md flex items-center gap-2 shadow-md"
              onClick={() => setTxnModalOpen(true)}
            >
              <Plus className="w-5 h-5" />
              <span className="hidden md:inline">Add Expense</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-full hover:bg-gray-100"
              onClick={() => {}}
            >
              <Share2 className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4">
        {/* Group Details Card */}
        <motion.div
          className="bg-white p-6 rounded-xl shadow-md mb-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            variants={itemVariants}
            className="flex justify-between items-center mb-4"
          >
            <div>
              <p className="text-gray-500">
                Created on: {new Date(group?.createdAt).toLocaleDateString()}
              </p>
              <h2 className="font-semibold text-xl mt-2">
                Your Balance:{" "}
                <span
                  className={
                    totalBalance >= 0 ? "text-green-500" : "text-red-500"
                  }
                >
                  {formatCurrency(totalBalance)}
                </span>
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <motion.div
                className="bg-indigo-100 w-12 h-12 rounded-full flex items-center justify-center text-xl"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                👥
              </motion.div>
              <div className="text-right">
                <p className="font-medium">{group?.members.length} members</p>
                <p className="text-sm text-gray-500">
                  {group?.expenses.length} transactions
                </p>
              </div>
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4"
          >
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-gray-500">Total Spent</p>
              <p className="font-bold text-lg">
                {formatCurrency(
                  group?.expenses?.reduce((acc, txn) => acc + txn.amount, 0)
                )}
              </p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <p className="text-sm text-gray-500">You Paid</p>
              <p className="font-bold text-lg">
                {formatCurrency(
                  group?.expenses
                    .filter((t) => t.paidBy === currentUser)
                    .reduce((acc, txn) => acc + txn.amount, 0)
                )}
              </p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <p className="text-sm text-gray-500">Your Share</p>
              <p className="font-bold text-lg">
                {formatCurrency(
                  group?.expenses?.reduce((acc, txn) => {
                    const includedParticipants =
                      txn.splits?.filter((p) => p.userId)?.length ||
                      txn.splits?.length ||
                      group?.members.length;
                    return acc + txn.amount / includedParticipants;
                  }, 0)
                )}
              </p>
            </div>
            <div className="bg-amber-50 p-3 rounded-lg">
              <p className="text-sm text-gray-500">Settlements</p>
              <p className="font-bold text-lg">
                {formatCurrency(
                  group?.expenses
                    .filter((t) => t.paidBy)
                    .reduce((acc, txn) => acc + txn.amount, 0)
                )}
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Tabs */}
        <div className="flex border-b mb-6">
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "transactions"
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("transactions")}
          >
            Expenses
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "balances"
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("balances")}
          >
            Balances
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "members"
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("members")}
          >
            Members
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "summary"
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("summary")}
          >
            Summary
          </button>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {/* Expenses Tab */}
            {activeTab === "transactions" && group?.expenses && (
              <motion.div
                className="space-y-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {group?.expenses.map((expense) => (
                  <motion.div
                    key={expense.id}
                    className="p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
                    variants={itemVariants}
                    whileHover={{ y: -2 }}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-lg">
                          {categories.find((c) => c.id === expense.category)
                            ?.icon || "📌"}
                        </div>
                        <div>
                          <h3 className="font-medium">{expense.description}</h3>
                          <p className="text-sm text-gray-500">
                            {new Date(expense.date).toLocaleDateString()} • Paid
                            by{" "}
                            {
                              group?.members.find(
                                (m) => m.id === expense.paidBy
                              )?.name
                            }
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">
                          {formatCurrency(expense.amount)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {expense.splitType === SplitType.Equal
                            ? "Split equally"
                            : "Custom split"}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Balances Tab */}
            {activeTab === "balances" && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-lg font-medium mb-4">Member Balances</h2>

                {Object.entries(memberBalances).map(([memberId, balance]) => {
                  const member = group?.members.find((m) => m.id === memberId);
                  if (!member) return null;

                  return (
                    <motion.div
                      key={memberId}
                      className="flex justify-between items-center py-3 border-b last:border-b-0"
                      whileHover={{ x: 5 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                          {member.name.charAt(0).toUpperCase()}
                        </div>
                        <span>{member.name}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span
                          className={
                            balance.amount > 0
                              ? "text-green-500"
                              : balance.amount < 0
                              ? "text-red-500"
                              : "text-gray-500"
                          }
                        >
                          {balance.amount > 0
                            ? `owes you ${formatCurrency(balance.amount)}`
                            : balance.amount < 0
                            ? `you owe ${formatCurrency(
                                Math.abs(balance.amount)
                              )}`
                            : "settled up"}
                        </span>

                        {balance.amount !== 0 && (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-3 py-1 rounded-md text-sm"
                            onClick={() => {
                              setSelectedMember(memberId);
                              setSettleModalOpen(true);
                            }}
                          >
                            Settle
                          </motion.button>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* Members Tab */}
            {activeTab === "members" && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium">Group Members</h2>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-3 py-1 rounded-md text-sm flex items-center gap-1"
                    onClick={() => setMemberModalOpen(true)}
                  >
                    <UserPlus className="w-4 h-4" />
                    Add Member
                  </motion.button>
                </div>

                <div className="space-y-3">
                  {group?.members.map((member) => (
                    <motion.div
                      key={member.id}
                      className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-50"
                      whileHover={{ x: 5 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-lg font-medium">
                          {member.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium">{member.name}</span>
                        {member.id === currentUser && (
                          <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded">
                            You
                          </span>
                        )}
                      </div>

                      {member.id !== currentUser && (
                        <div className="flex items-center gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="bg-gray-100 hover:bg-gray-200 p-2 rounded-full"
                          >
                            <Mail className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="bg-gray-100 hover:bg-gray-200 p-2 rounded-full"
                          >
                            <Phone className="w-4 h-4" />
                          </motion.button>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Add Transaction Floating Button - Mobile only */}
      <motion.button
        className="fixed bottom-6 right-6 bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-lg md:hidden"
        onClick={() => setTxnModalOpen(true)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <Plus className="w-6 h-6" />
      </motion.button>

      {/* Add Transaction Modal */}
      <AnimatePresence>
        {isTxnModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
            <motion.div
              className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Add Expense</h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setTxnModalOpen(false)}
                  className="p-1 rounded-full hover:bg-gray-100"
                >
                  <X className="w-6 h-6" />
                </motion.button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    placeholder="What was this expense for?"
                    value={txnForm.description}
                    onChange={(e) =>
                      setTxnForm({ ...txnForm, description: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <DollarSign className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={txnForm.amount}
                      onChange={(e) =>
                        setTxnForm({ ...txnForm, amount: e.target.value })
                      }
                      className="w-full p-3 pl-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={txnForm.date}
                    onChange={(e) =>
                      setTxnForm({ ...txnForm, date: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {categories.map((cat) => (
                      <motion.button
                        key={cat.id}
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`p-2 rounded-md flex flex-col items-center justify-center ${
                          txnForm.category === cat.id
                            ? "bg-indigo-100 border-2 border-indigo-500"
                            : "bg-gray-50 border border-gray-200"
                        }`}
                        onClick={() =>
                          setTxnForm({ ...txnForm, category: cat.id })
                        }
                      >
                        <span className="text-2xl mb-1">{cat.icon}</span>
                        <span className="text-xs">{cat.name}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Paid By
                  </label>
                  <select
                    value={txnForm.paidBy}
                    onChange={(e) =>
                      setTxnForm({ ...txnForm, paidBy: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    {group?.members.map((member) => (
                      <option key={member.id} value={member.id}>
                        {member.id === currentUser
                          ? `${member.name} (You)`
                          : member.name}
                      </option>
                    ))}
                  </select>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md shadow-sm"
                  onClick={handleAddTransaction}
                  disabled={!txnForm.amount || !txnForm.paidBy}
                >
                  Add Expense
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Member Modal */}
      <AnimatePresence>
        {isMemberModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
            <motion.div
              className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Add Member</h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setMemberModalOpen(false)}
                  className="p-1 rounded-full hover:bg-gray-100"
                >
                  <X className="w-6 h-6" />
                </motion.button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter member name"
                    value={newMember.name}
                    onChange={(e) =>
                      setNewMember({ ...newMember, name: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="Enter email address"
                    value={newMember.email}
                    onChange={(e) =>
                      setNewMember({ ...newMember, email: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    placeholder="Enter phone number"
                    value={newMember.phone}
                    onChange={(e) =>
                      setNewMember({ ...newMember, phone: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md shadow-sm"
                  onClick={handleAddMember}
                  disabled={!newMember.name.trim()}
                >
                  Add Member
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Settle Debt Modal */}
      <AnimatePresence>
        {isSettleModalOpen && selectedMember && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
            <motion.div
              className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Settle Balance</h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSettleModalOpen(false)}
                  className="p-1 rounded-full hover:bg-gray-100"
                >
                  <X className="w-6 h-6" />
                </motion.button>
              </div>

              <div className="text-center mb-6">
                {memberBalances[selectedMember]?.amount > 0 ? (
                  <div>
                    <p className="text-lg mb-2">
                      {
                        group?.members.find((m) => m.id === selectedMember)
                          ?.name
                      }{" "}
                      owes you
                    </p>
                    <p className="text-3xl font-bold text-green-500">
                      {formatCurrency(
                        memberBalances[selectedMember]?.amount || 0
                      )}
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-lg mb-2">
                      You owe{" "}
                      {
                        group?.members.find((m) => m.id === selectedMember)
                          ?.name
                      }
                    </p>
                    <p className="text-3xl font-bold text-red-500">
                      {formatCurrency(
                        Math.abs(memberBalances[selectedMember]?.amount || 0)
                      )}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-gray-700">
                    {memberBalances[selectedMember]?.amount > 0 ? (
                      <>
                        <span className="font-medium">Mark as settled</span> if{" "}
                        {
                          group?.members.find((m) => m.id === selectedMember)
                            ?.name
                        }{" "}
                        has paid you back.
                      </>
                    ) : (
                      <>
                        <span className="font-medium">Mark as settled</span> if
                        you've paid{" "}
                        {
                          group?.members.find((m) => m.id === selectedMember)
                            ?.name
                        }{" "}
                        back.
                      </>
                    )}
                  </p>
                </div>

                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-md shadow-sm"
                    onClick={() => setSettleModalOpen(false)}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md shadow-sm"
                    onClick={handleSettleDebt}
                  >
                    Mark as Settled
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
