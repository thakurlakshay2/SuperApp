import React from "react";
import { Expense, User } from "../../app/payUrFren/types";
import { motion } from "framer-motion";
import { Receipt, MoreVertical } from "lucide-react";
import { formatCurrency } from "../../app/payUrFren/utils";

interface ExpenseCardProps {
  expense: Expense;
  currentUser: User;
  groupMembers: User[];
  onEdit?: () => void;
  onDelete?: () => void;
}

const ExpenseCard: React.FC<ExpenseCardProps> = ({
  expense,
  currentUser,
  groupMembers,
  onEdit,
  onDelete,
}) => {
  const paidByUser = groupMembers.find(
    (member) => member.id === expense.paidBy
  );
  const userSplit = expense.splits.find(
    (split) => split.userId === currentUser.id
  );
  const isOwed = userSplit && userSplit.amount > 0;
  const isOwes = userSplit && userSplit.amount < 0;

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="bg-white rounded-xl shadow-sm p-4"
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <Receipt className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{expense.description}</h3>
            <p className="text-sm text-gray-500">
              {new Date(expense.date).toLocaleDateString()} • Paid by{" "}
              {paidByUser?.name}
            </p>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-500">Your share</p>
          <p
            className={`text-lg font-semibold ${
              isOwed
                ? "text-green-600"
                : isOwes
                ? "text-red-600"
                : "text-gray-600"
            }`}
          >
            {isOwed ? "You are owed " : isOwes ? "You owe " : "Settled up "}
            {userSplit && formatCurrency(Math.abs(userSplit.amount), "INR")}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Total amount</p>
          <p className="text-lg font-semibold text-gray-900">
            {formatCurrency(expense.amount, "INR")}
          </p>
        </div>
      </div>

      {expense.notes && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-sm text-gray-500">{expense.notes}</p>
        </div>
      )}

      {expense.attachments && expense.attachments.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-sm text-gray-500 mb-2">Attachments</p>
          <div className="flex gap-2">
            {expense.attachments.map((attachment, index) => (
              <img
                key={index}
                src={attachment}
                alt={`Attachment ${index + 1}`}
                className="w-16 h-16 rounded-lg object-cover"
              />
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ExpenseCard;
