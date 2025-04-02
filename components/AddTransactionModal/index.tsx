import React, { useState } from "react";
import { Button } from "../Button";

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTransaction: (groupId: number, transaction: any) => void;
  groups: any[];
}

export default function AddTransactionModal({
  isOpen,
  onClose,
  onAddTransaction,
  groups,
}: AddTransactionModalProps) {
  const [groupId, setGroupId] = useState(groups[0]?.id || "");
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("sent");

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!name || !amount) return;

    onAddTransaction(groupId, {
      id: Date.now(),
      name,
      amount: parseFloat(amount),
      type,
      currency: "USD",
      timestamp: new Date().toLocaleTimeString(),
    });

    onClose();
  };

  return (
    <div className=" bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-semibold mb-4">Add Transaction</h2>

        <label className="block mb-2">Select Group</label>
        <select
          className="w-full border p-2 rounded-md mb-4"
          value={groupId}
          onChange={(e) => setGroupId(Number(e.target.value))}
        >
          {groups.map((group) => (
            <option key={group.id} value={group.id}>
              {group.name}
            </option>
          ))}
        </select>

        <label className="block mb-2">Name</label>
        <input
          type="text"
          className="w-full border p-2 rounded-md mb-4"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label className="block mb-2">Amount</label>
        <input
          type="number"
          className="w-full border p-2 rounded-md mb-4"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <label className="block mb-2">Type</label>
        <select
          className="w-full border p-2 rounded-md mb-4"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="sent">Sent</option>
          <option value="received">Received</option>
        </select>

        <div className="flex justify-end space-x-2">
          <Button
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={handleSubmit}
          >
            Add
          </Button>
        </div>
      </div>
    </div>
  );
}
