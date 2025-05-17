import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Expense,
  User,
  ExpenseCategory,
  SplitType,
} from "../../app/payUrFren/types";
import {
  X,
  Image as ImageIcon,
  DollarSign,
  Calendar,
  Users,
} from "lucide-react";

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (expense: Partial<Expense>) => void;
  currentUser: User;
  groupMembers: User[];
}

const AddExpenseModal: React.FC<AddExpenseModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  currentUser,
  groupMembers,
}) => {
  const [expenseData, setExpenseData] = useState<Partial<Expense>>({
    description: "",
    amount: 0,
    paidBy: currentUser.id,
    date: new Date(),
    category: ExpenseCategory.Other,
    splitType: SplitType.Equal,
    splits: groupMembers.map((member) => ({
      userId: member.id,
      amount: 0,
    })),
  });

  const handleSubmit = () => {
    onSubmit(expenseData);
    onClose();
  };

  const handleSplitChange = (userId: string, amount: number) => {
    setExpenseData((prev) => ({
      ...prev,
      splits: prev.splits?.map((split) =>
        split.userId === userId ? { ...split, amount } : split
      ),
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Add New Expense</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <input
                type="text"
                value={expenseData.description}
                onChange={(e) =>
                  setExpenseData({
                    ...expenseData,
                    description: e.target.value,
                  })
                }
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="What was this expense for?"
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
                  value={expenseData.amount}
                  onChange={(e) =>
                    setExpenseData({
                      ...expenseData,
                      amount: Number(e.target.value),
                    })
                  }
                  className="w-full pl-10 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Calendar className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  value={expenseData.date?.toISOString().split("T")[0]}
                  onChange={(e) =>
                    setExpenseData({
                      ...expenseData,
                      date: new Date(e.target.value),
                    })
                  }
                  className="w-full pl-10 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={expenseData.category}
                onChange={(e) =>
                  setExpenseData({
                    ...expenseData,
                    category: e.target.value as ExpenseCategory,
                  })
                }
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {Object.values(ExpenseCategory).map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Paid by
              </label>
              <select
                value={expenseData.paidBy}
                onChange={(e) =>
                  setExpenseData({ ...expenseData, paidBy: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {groupMembers.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Split Type
              </label>
              <select
                value={expenseData.splitType}
                onChange={(e) =>
                  setExpenseData({
                    ...expenseData,
                    splitType: e.target.value as SplitType,
                  })
                }
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {Object.values(SplitType).map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Split Details
              </label>
              <div className="space-y-2">
                {groupMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between"
                  >
                    <span className="text-gray-700">{member.name}</span>
                    <input
                      type="number"
                      value={
                        expenseData.splits?.find((s) => s.userId === member.id)
                          ?.amount || 0
                      }
                      onChange={(e) =>
                        handleSplitChange(member.id, Number(e.target.value))
                      }
                      className="w-24 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes (Optional)
              </label>
              <textarea
                value={expenseData.notes}
                onChange={(e) =>
                  setExpenseData({ ...expenseData, notes: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Add any additional notes..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Attachments (Optional)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <ImageIcon className="w-8 h-8 mx-auto text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">
                  Drag and drop files here, or click to select files
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add Expense
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AddExpenseModal;
