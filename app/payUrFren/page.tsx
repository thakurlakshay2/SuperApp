"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import GroupList from "./components/GroupList";
import Header from "./components/Header";
import AddGroupModal from "./components/AddGroupModal";
import { mockUsers, mockGroups } from "./mockData";
import { Group, User } from "./types";

export default function Page() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [isAddGroupModalOpen, setIsAddGroupModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const currentUser = mockUsers[0]; // In a real app, this would come from auth context

  // Load groups on component mount
  useEffect(() => {
    const loadGroups = async () => {
      try {
        setIsLoading(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setGroups(mockGroups);
        setError(null);
      } catch (err) {
        setError("Failed to load groups. Please try again later.");
        console.error("Error loading groups:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadGroups();
  }, []);

  const handleAddGroup = async (newGroup: Partial<Group>) => {
    try {
      setIsLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const group: Group = {
        ...newGroup,
        id: String(Date.now()), // Use timestamp for unique ID
        members: newGroup.members || [],
        createdAt: new Date(),
        updatedAt: new Date(),
        currency: newGroup.currency || "INR",
        themeColor: newGroup.themeColor || "#4CAF50",
        expenses: [],
      } as Group;

      setGroups((prevGroups) => [...prevGroups, group]);
      setIsAddGroupModalOpen(false);
    } catch (err) {
      setError("Failed to create group. Please try again.");
      console.error("Error creating group:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        currentUser={currentUser}
        onAddGroup={() => setIsAddGroupModalOpen(true)}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Your Groups</h1>
            <p className="mt-2 text-gray-600">
              Manage your expense groups and track shared expenses
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          <GroupList
            groups={groups}
            currentUser={currentUser}
            isLoading={isLoading}
          />
        </motion.div>
      </main>

      <AddGroupModal
        isOpen={isAddGroupModalOpen}
        onClose={() => setIsAddGroupModalOpen(false)}
        onSubmit={handleAddGroup}
        currentUser={currentUser}
        availableUsers={mockUsers}
      />
    </div>
  );
}
