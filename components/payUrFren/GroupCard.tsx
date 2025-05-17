import React from "react";
import { Group, User } from "../../app/payUrFren/types";
import { motion } from "framer-motion";
import { Users, Calendar, ArrowRight } from "lucide-react";
import { formatCurrency } from "../../app/payUrFren/utils";
import Link from "next/link";

interface GroupCardProps {
  group: Group;
  currentUser: User;
}

const GroupCard: React.FC<GroupCardProps> = ({ group, currentUser }) => {
  const getMemberBalance = (userId: string) => {
    const userExpenses =
      group.expenses?.filter((expense) => expense.paidBy === userId) || [];
    const userSplits =
      group.expenses?.flatMap((expense) =>
        expense.splits.filter((split) => split.userId === userId)
      ) || [];

    const paid = userExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const owes = userSplits.reduce((sum, split) => sum + split.amount, 0);

    return paid - owes;
  };

  const userBalance = getMemberBalance(currentUser.id);
  const isOwed = userBalance > 0;
  const isOwes = userBalance < 0;

  return (
    <Link href={`/payUrFren/${group.id}`}>
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="bg-white rounded-xl shadow-md p-6 cursor-pointer"
        style={{ borderLeft: `4px solid ${group.themeColor}` }}
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-800">
              {group.name}
            </h3>
            <p className="text-gray-500 text-sm">{group.description}</p>
          </div>
          <div className="flex items-center gap-2 text-gray-500">
            <Users className="w-4 h-4" />
            <span>{group.members.length}</span>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <Calendar className="w-4 h-4" />
            <span>
              Created {new Date(group.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>
              Last updated {new Date(group.updatedAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">Your balance</p>
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
              {userBalance !== 0 &&
                formatCurrency(Math.abs(userBalance), group.currency)}
            </p>
          </div>
          <ArrowRight className="w-5 h-5 text-gray-400" />
        </div>
      </motion.div>
    </Link>
  );
};

export default GroupCard;
