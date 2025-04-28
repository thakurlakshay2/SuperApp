import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Group, User } from "../types";
import { X, ArrowLeft, ArrowRight, Image as ImageIcon } from "lucide-react";

interface AddGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (group: Partial<Group>) => void;
  currentUser: User;
  availableUsers: User[];
}

enum AddGroupStep {
  GroupInfo,
  GroupMembers,
}

const AddGroupModal: React.FC<AddGroupModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  currentUser,
  availableUsers,
}) => {
  const [step, setStep] = useState<AddGroupStep>(AddGroupStep.GroupInfo);
  const [groupData, setGroupData] = useState<Partial<Group>>({
    name: "",
    description: "",
    members: [currentUser],
    currency: "INR",
    themeColor: "#4CAF50",
  });

  const handleSubmit = () => {
    onSubmit({
      ...groupData,
      createdBy: currentUser.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    onClose();
  };

  const handleNext = () => {
    if (step === AddGroupStep.GroupInfo) {
      setStep(AddGroupStep.GroupMembers);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step === AddGroupStep.GroupMembers) {
      setStep(AddGroupStep.GroupInfo);
    }
  };

  const toggleMember = (user: User) => {
    setGroupData((prev) => {
      const isMember = prev.members?.some((m) => m.id === user.id);
      const newMembers = isMember
        ? prev.members?.filter((m) => m.id !== user.id)
        : [...(prev.members || []), user];
      return { ...prev, members: newMembers };
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl w-full max-w-2xl mx-4"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Add New Group</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <AnimatePresence mode="wait">
            {step === AddGroupStep.GroupInfo && (
              <motion.div
                key="group-info"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 20, opacity: 0 }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Group Name
                  </label>
                  <input
                    type="text"
                    value={groupData.name}
                    onChange={(e) =>
                      setGroupData({ ...groupData, name: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter group name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={groupData.description}
                    onChange={(e) =>
                      setGroupData({
                        ...groupData,
                        description: e.target.value,
                      })
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter group description"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Theme Color
                  </label>
                  <input
                    type="color"
                    value={groupData.themeColor}
                    onChange={(e) =>
                      setGroupData({ ...groupData, themeColor: e.target.value })
                    }
                    className="w-full h-10 rounded-lg cursor-pointer"
                  />
                </div>
              </motion.div>
            )}

            {step === AddGroupStep.GroupMembers && (
              <motion.div
                key="group-members"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Members
                  </label>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {availableUsers.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between p-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-3">
                          {user.avatar ? (
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="w-8 h-8 rounded-full"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                              <ImageIcon className="w-5 h-5 text-gray-500" />
                            </div>
                          )}
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-gray-500">
                              {user.email}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => toggleMember(user)}
                          className={`px-3 py-1 rounded-full text-sm ${
                            groupData.members?.some((m) => m.id === user.id)
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {groupData.members?.some((m) => m.id === user.id)
                            ? "Selected"
                            : "Select"}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-between mt-6">
            <button
              onClick={handleBack}
              className={`flex items-center gap-2 px-4 py-2 text-gray-700 ${
                step === AddGroupStep.GroupInfo ? "invisible" : ""
              }`}
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {step === AddGroupStep.GroupInfo ? "Next" : "Create Group"}
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AddGroupModal;
