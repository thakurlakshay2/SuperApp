// components/InflationAdjuster.tsx
"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface InflationAdjusterProps {
  enabled: boolean;
  setEnabled: Dispatch<SetStateAction<boolean>>;
  inflation: number;
  onInflationChange: (value: number) => void;
}

const InflationAdjuster: React.FC<InflationAdjusterProps> = ({
  enabled,
  setEnabled,
  inflation,
  onInflationChange,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className=" bg-red-100 shadow-lg rounded-xl p-4"
    >
      <div className="flex items-center space-x-3">
        <input
          type="checkbox"
          id="toggleInflation"
          checked={enabled}
          onChange={() => setEnabled((prev) => !prev)}
          className="h-5 w-5 text-red-600 border-gray-300 rounded focus:ring-red-500"
        />
        <label
          htmlFor="toggleInflation"
          className="text-md   font-semibold  text-gray-800 cursor-pointer"
        >
          Adjust for Inflation
        </label>

        <AnimatePresence>
          {enabled && (
            <motion.input
              key="inflationInput"
              type="number"
              value={inflation}
              onChange={(e) => onInflationChange(Number(e.target.value))}
              min={0}
              step={0.2}
              className="appearance-none box-border ml-4 w-20 px-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 text-right text-gray-800 bg-white/60 backdrop-blur-sm box-border"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default InflationAdjuster;
