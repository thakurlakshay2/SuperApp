"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Filter, ChevronDown } from "lucide-react";
import TotalBalance from "@/components/TotalBalance";
import GroupList from "@/components/GroupedList";
import { Button } from "@/components/Button";
import { Modal } from "@/shared/Modal";
import AddGroup from "@/components/AddGroup";
type Transaction = {
  id: number;
  name: string;
  amount: number;
  type: "sent" | "received";
  timestamp: string;
};

export enum AddGroupStep {
  GroupInfo,
  GroupMembers,
}
type Group = {
  id: number;
  name: string;
  createdAt: string;
  members: string[];
  transactions: Transaction[];
};

const initialGroups: Group[] = [
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
        timestamp: "10:30 AM",
      },
      {
        id: 2,
        name: "Bob",
        amount: 75,
        type: "received",
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
        timestamp: "1:00 PM",
      },
    ],
  },
];

export default function Page() {
  const [groups, setGroups] = useState<Group[]>(initialGroups);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [sortOption, setSortOption] = useState<string>("lastAdded");
  const [filterOption, setFilterOption] = useState<string>("");
  const [addGroupStep, setGroupStep] = useState<AddGroupStep>(
    AddGroupStep.GroupInfo
  );
  // Sorting Function
  const sortGroups = (groups: Group[]): Group[] => {
    return [...groups].sort((a, b) => {
      if (sortOption === "lastAdded")
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      if (sortOption === "firstAdded")
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      if (sortOption === "alphaAsc") return a.name.localeCompare(b.name);
      if (sortOption === "alphaDesc") return b.name.localeCompare(a.name);
      return 0;
    });
  };

  // Filter Function
  const filterGroups = (groups: Group[]): Group[] => {
    if (filterOption === "updatedLastWeek") {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      return groups.filter((group) => new Date(group.createdAt) >= oneWeekAgo);
    }
    return groups;
  };

  const displayedGroups: Group[] = filterGroups(sortGroups(groups));

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

      <div className="flex gap-8 w-full mb-8 justify-center">
        <TotalBalance groups={groups} isLoading={isLoading} />{" "}
        <Button
          className="invisible md:visible w-1/3  bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-lg"
          onClick={() => setIsModalOpen(true)}
        >
          Add Group
        </Button>
      </div>
      {/* Top Bar: Total Owed Amount */}

      {/* Filters & Sorting */}
      <div className="w-full mb-4">
        <div className="flex justify-between items-center bg-white shadow-md p-3 rounded-lg">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              <Filter className="w-4 h-4 mr-2" /> Filters
            </Button>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="border px-3 py-2 rounded-md"
            >
              <option value="lastAdded">Last Added</option>
              <option value="firstAdded">First Added</option>
              <option value="alphaAsc">Alphabetical (A-Z)</option>
              <option value="alphaDesc">Alphabetical (Z-A)</option>
            </select>
          </div>
        </div>

        {/* Filter Dropdown (Mobile) */}
        {isFilterOpen && (
          <div className="mt-3 bg-white p-3 rounded-md shadow-md">
            <label className="block">
              <input
                type="checkbox"
                onChange={() => setFilterOption("updatedLastWeek")}
                checked={filterOption === "updatedLastWeek"}
              />{" "}
              Updated in last week
            </label>
          </div>
        )}
      </div>

      {/* Group List */}
      <GroupList groups={displayedGroups} isLoading={isLoading} />

      {/* Show Settled Groups Button */}
      <Button className="mt-4 bg-gray-500 text-white px-6 py-2 rounded-md">
        Show Settled Groups
      </Button>

      {/* Add Transaction Floating Button */}
      <Button
        className="visible md:invisible fixed bottom-6 right-6 bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-lg"
        onClick={() => setIsModalOpen(true)}
      >
        <Plus className="w-8 h-8" />
      </Button>

      {/* Add Transaction Modal */}
      <Modal
        heading={"Add Group"}
        openModal={isModalOpen}
        setOpenModal={setIsModalOpen}
        modalContent={
          <AddGroup
            onClose={() => {
              setIsModalOpen(false);
            }}
            onCreateGroup={() => {}}
            // groupStep={addGroupStep}
          />
        }
      />
    </div>
  );
}
