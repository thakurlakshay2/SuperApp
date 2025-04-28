import React from "react";
import { User } from "../types";
import { motion } from "framer-motion";
import { Bell, Plus, User as UserIcon } from "lucide-react";
import Link from "next/link";

interface HeaderProps {
  currentUser: User;
  onAddGroup: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentUser, onAddGroup }) => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link
              href="/payUrFren"
              className="text-2xl font-bold text-blue-600"
            >
              PayUrFren
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onAddGroup}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden md:inline">Add Group</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 text-gray-500 hover:text-gray-700"
            >
              <Bell className="w-6 h-6" />
            </motion.button>

            <div className="relative">
              <button className="flex items-center gap-2">
                {currentUser.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <UserIcon className="w-5 h-5 text-gray-500" />
                  </div>
                )}
                <span className="hidden md:inline text-gray-700">
                  {currentUser.name}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
