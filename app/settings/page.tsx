"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";

const tabs = [
  { id: "personal", label: "Personal Info" },
  { id: "wallet", label: "Crypto Wallet Info" },
  { id: "security", label: "Security" },
  { id: "about", label: "About Us" },
];

const tabContent = {
  personal: (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Personal Information</h2>
      <p className="mb-2">Name: John Doe</p>
      <p className="mb-2">Email: johndoe@example.com</p>
      <p className="mb-4">Phone: +123 456 7890</p>
      <button className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
        Edit
      </button>
    </div>
  ),
  wallet: (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Crypto Wallet Info</h2>
      <p className="mb-2">Wallet Address: 0x1234...abcd</p>
      <p className="mb-2">Balance: 2.5 ETH</p>
      <p className="mb-4">Transactions: 20</p>
      <button className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
        View Details
      </button>
    </div>
  ),
  security: (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Security Settings</h2>
      <p className="mb-2">2FA: Enabled</p>
      <p className="mb-2">Login Alerts: On</p>
      <p className="mb-4">Password Last Changed: 3 months ago</p>
      <button className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
        Update Security
      </button>
    </div>
  ),
  about: (
    <div>
      <h2 className="text-2xl font-semibold mb-4">About Us</h2>
      <p className="mb-2">
        We are a leading crypto platform providing secure transactions.
      </p>
      <p className="mb-2">
        Founded in 2020, we aim to revolutionize the digital asset space.
      </p>
      <p>Contact us at: support@example.com</p>
    </div>
  ),
};

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("personal");

  return (
    <main className=" m-auto	 flex min-h-screen flex-col items-center px-24 py-8">
      <Header />
      {/* code inrovement required , very un utilised space right now */}
      {/* <div className="min-h-screen bg-gray-100 text-black flex flex-col items-center p-10">
        <div className="w-full max-w-3xl bg-white shadow-xl rounded-lg p-6">
          <div className="flex justify-between border-b border-gray-300 mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`relative flex-1 py-3 text-center text-lg font-medium transition-all ${
                  activeTab === tab.id ? "text-blue-600" : "text-gray-600"
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="underline"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600"
                  />
                )}
              </button>
            ))}
          </div>
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="p-6 text-gray-800 min-h-[200px]"
          >
            {tabContent[activeTab]}
          </motion.div>
        </div>
      </div> */}
    </main>
  );
}
