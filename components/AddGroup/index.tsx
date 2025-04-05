import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Home,
  Briefcase,
  Heart,
  MoreHorizontal,
  CheckCircle,
} from "lucide-react";

// Enum for group types
enum GroupType {
  Trip = "Trip",
  Home = "Home",
  Roommates = "Roommates",
  Couple = "Couple",
  Other = "Other",
}

// Props interface
interface AddGroupModalContentProps {
  onClose: () => void;
  onCreateGroup: (groupData: {
    name: string;
    type: GroupType;
    members: string[];
  }) => void;
}

// Function to generate a random Identicon as fallback
const getRandomIdenticon = (seed: string) => {
  return `https://source.boringavatars.com/beam/120/${encodeURIComponent(
    seed
  )}?colors=264653,2a9d8f,e9c46a,f4a261,e76f51`;
};

// Function to fetch AI-generated image (debounced)
const getAiGeneratedImage = async (groupName: string) => {
  if (!groupName) return getRandomIdenticon(""); // Fallback to Identicon

  const firstWord = groupName.split(" ")[0]; // Extract first word
  const searchQuery = encodeURIComponent(firstWord);

  try {
    const response = await fetch(
      `https://lexica.art/api/v1/search?q=${searchQuery}`
    );
    const data = await response.json();

    if (data.images && data.images.length > 0) {
      return data.images[0].src; // Return first AI-generated image
    }
  } catch (error) {
    console.error("Error fetching AI-generated image:", error);
  }

  return getRandomIdenticon(groupName); // Fallback if API fails
};

const getRandomImage2 = (groupName: string) => {
  const seed = groupName.trim().split("");

  return `https://api.dicebear.com/7.x/identicon/svg?seed=${seed}`;
};
export const debouncegetRandomImage2 = (() => {
  let debounceTimer: NodeJS.Timeout;

  return (groupName: string, setImage: (img: string) => void) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(async () => {
      const imgUrl = await getRandomImage2(groupName);
      setImage(imgUrl);
    }, 500); // 500ms delay
  };
})();
// Wrapper function with debounce
export const getRandomImage = (() => {
  let debounceTimer: NodeJS.Timeout;

  return (groupName: string, setImage: (img: string) => void) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(async () => {
      const imgUrl = await getAiGeneratedImage(groupName);
      setImage(imgUrl);
    }, 500); // 500ms delay
  };
})();
export default function AddGroupModalContent({
  onClose,
  onCreateGroup,
}: AddGroupModalContentProps) {
  const [step, setStep] = useState<"GroupInfo" | "AddMembers">("GroupInfo");
  const [name, setName] = useState<string>("");
  const [type, setType] = useState<GroupType | null>(null);
  const [members, setMembers] = useState<string[]>([
    "alice@email.com",
    "bob@email.com",
  ]);
  const [newMember, setNewMember] = useState<string>("");

  const handleAddMember = () => {
    if (newMember && !members.includes(newMember)) {
      setMembers([...members, newMember]);
      setNewMember("");
    }
  };

  const handleSubmit = () => {
    if (!name || !type) return;
    onCreateGroup({ name, type, members });
    onClose();
  };

  const [image, setImage] = useState(getRandomIdenticon(""));

  useEffect(() => {
    debouncegetRandomImage2(name, setImage);
  }, [name]);

  return (
    <motion.div
      className="p-4 w-full sm:w-4/5 md:w-3/4 lg:w-1/2 xl:w-[40%]"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      {step === "GroupInfo" ? (
        <>
          {/* Step 1: Group Info */}
          <h2 className="text-lg font-semibold mb-4">Create Group</h2>
          <div className="flex justify-center mb-4">
            <img
              src={image}
              alt="Group"
              className="w-24 h-24 rounded-full shadow-md"
            />
          </div>
          <label className="block mb-2 text-sm font-medium">Group Name</label>
          <input
            type="text"
            className="w-full border p-2 rounded-md mb-4"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <label className="block mb-2 text-sm font-medium">Group Type</label>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {Object.values(GroupType).map((group) => (
              <button
                key={group}
                className={`p-3 rounded-md transition-all flex flex-col items-center justify-center text-sm font-medium ${
                  type === group ? "bg-indigo-500 text-white" : "bg-gray-200"
                }`}
                onClick={() => setType(group)}
              >
                {group === "Trip" && <Users className="w-5 h-5" />}
                {group === "Home" && <Home className="w-5 h-5" />}
                {group === "Roommates" && <Briefcase className="w-5 h-5" />}
                {group === "Couple" && <Heart className="w-5 h-5" />}
                {group === "Other" && <MoreHorizontal className="w-5 h-5" />}
                <span>{group}</span>
              </button>
            ))}
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <button
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="bg-indigo-500 text-white px-4 py-2 rounded"
              onClick={() => setStep("AddMembers")}
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <>
          {/* Step 2: Add Members */}
          <h2 className="text-lg font-semibold mb-4">Add Members</h2>
          <div className="mb-4 space-y-2">
            {members.map((member, index) => (
              <div
                key={index}
                className="flex justify-between items-center border p-2 rounded-md"
              >
                <span>{member}</span>
                <CheckCircle className="text-green-500 w-5 h-5" />
              </div>
            ))}
          </div>
          <input
            type="text"
            placeholder="Add email/phone"
            className="w-full border p-2 rounded-md mb-4"
            value={newMember}
            onChange={(e) => setNewMember(e.target.value)}
          />
          <button
            className="w-full bg-indigo-500 text-white px-4 py-2 rounded mb-4"
            onClick={handleAddMember}
          >
            Send Request
          </button>
          <div className="flex justify-end space-x-2">
            <button
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
              onClick={() => setStep("GroupInfo")}
            >
              Back
            </button>
            <button
              className="bg-green-500 text-white px-4 py-2 rounded"
              onClick={handleSubmit}
            >
              Create Group
            </button>
          </div>
        </>
      )}
    </motion.div>
  );
}
