"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Wallet,
  CalendarDays,
  Mail,
  DollarSign,
  TrendingUp,
  PieChart,
  Activity,
  Clock,
  Award,
  Zap,
} from "lucide-react";
import { ProfileProps } from "./typings";

// Extended type definition
interface EnhancedProfileProps extends ProfileProps {
  tradingVolume24h: number;
  totalTrades: number;
  successRate: number;
  avgHoldingPeriod: string;
  topHoldings: {
    symbol: string;
    amount: number;
    value: number;
    change24h: number;
  }[];
  achievements: {
    title: string;
    date: string;
    icon: string;
  }[];
  riskScore: number;
  preferredExchanges: string[];
  recentTransactions: {
    type: string;
    coin: string;
    amount: number;
    date: string;
    price: number;
  }[];
}

const ProfilePage: React.FC<EnhancedProfileProps> = ({
  name,
  email,
  walletAddress,
  dateOfBirth,
  joinDate,
  portfolioValue,
  profileImage,
  tradingVolume24h,
  totalTrades,
  successRate,
  avgHoldingPeriod,
  topHoldings,
  achievements,
  riskScore,
  preferredExchanges,
  recentTransactions,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 p-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Profile Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white/80 backdrop-blur-md shadow-2xl rounded-2xl p-8 lg:col-span-1 space-y-6"
        >
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center space-y-4"
          >
            <div className="relative">
              {profileImage && (
                <Image
                  src={profileImage}
                  alt={`${name}'s profile`}
                  width={150}
                  height={150}
                  className="rounded-full border-4 border-blue-200 shadow-lg"
                />
              )}
              <motion.div
                className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4 }}
              >
                <DollarSign size={20} />
              </motion.div>
            </div>

            <h1 className="text-2xl font-bold text-gray-800">{name}</h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <ProfileDetail
              icon={<Mail className="text-blue-500" />}
              label="Email"
              value={email}
            />
            <ProfileDetail
              icon={<Wallet className="text-blue-500" />}
              label="Wallet Address"
              value={walletAddress}
            />
            <ProfileDetail
              icon={<CalendarDays className="text-blue-500" />}
              label="Date of Birth"
              value={dateOfBirth}
            />
            <ProfileDetail
              icon={<CalendarDays className="text-blue-500" />}
              label="Join Date"
              value={joinDate}
            />
          </motion.div>
        </motion.div>

        {/* Trading Statistics and Portfolio */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Trading Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              icon={<DollarSign className="text-green-500" />}
              label="Portfolio Value"
              value={`$${portfolioValue.toLocaleString()}`}
            />
            <StatCard
              icon={<Activity className="text-blue-500" />}
              label="24h Volume"
              value={`$${tradingVolume24h.toLocaleString()}`}
            />
            <StatCard
              icon={<TrendingUp className="text-purple-500" />}
              label="Success Rate"
              value={`${successRate}%`}
            />
            <StatCard
              icon={<Clock className="text-orange-500" />}
              label="Avg Holding Time"
              value={avgHoldingPeriod}
            />
          </div>

          {/* Top Holdings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-xl"
          >
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <PieChart className="text-blue-500" />
              Top Holdings
            </h2>
            <div className="space-y-4">
              {topHoldings.map((holding, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-50 p-4 rounded-xl"
                >
                  <div>
                    <h3 className="font-semibold">{holding.symbol}</h3>
                    <p className="text-sm text-gray-500">
                      {holding.amount} tokens
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">
                      ${holding.value.toLocaleString()}
                    </p>
                    <p
                      className={`text-sm ${
                        holding.change24h >= 0
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {holding.change24h > 0 ? "+" : ""}
                      {holding.change24h}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent Transactions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-xl"
          >
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Activity className="text-blue-500" />
              Recent Transactions
            </h2>
            <div className="space-y-3">
              {recentTransactions.map((tx, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-50 p-3 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-full ${
                        tx.type === "buy" ? "bg-green-100" : "bg-red-100"
                      }`}
                    >
                      {tx.type === "buy" ? "↓" : "↑"}
                    </div>
                    <div>
                      <p className="font-semibold">{tx.coin}</p>
                      <p className="text-sm text-gray-500">{tx.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">${tx.price.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">{tx.amount} tokens</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

const ProfileDetail: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
}> = ({ icon, label, value }) => (
  <div className="flex items-center space-x-4 bg-gray-100 p-3 rounded-xl">
    <div className="bg-white p-2 rounded-full shadow-md">{icon}</div>
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm font-semibold text-gray-800">{value}</p>
    </div>
  </div>
);

const StatCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
}> = ({ icon, label, value }) => (
  <div className="bg-white/80 backdrop-blur-md rounded-xl p-4 shadow-lg">
    <div className="flex items-center gap-2 mb-2">
      {icon}
      <span className="text-sm text-gray-600">{label}</span>
    </div>
    <p className="text-xl font-bold text-gray-800">{value}</p>
  </div>
);

export default ProfilePage;
