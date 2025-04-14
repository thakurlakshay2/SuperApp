import React from "react";
import { motion } from "framer-motion";

type SliderProps = {
  min: number;
  max: number;
  value: number;
  step: number;
  onChange: (value: number) => void;
  className?: string;
};

const Slider: React.FC<SliderProps> = ({
  min,
  max,
  value,
  step,
  onChange,
  className = "",
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value));
  };

  const percent = ((value - min) / (max - min)) * 100;

  return (
    <div className={`w-full px-4 py-2 ${className}`}>
      <div className="relative w-full">
        {/* Track */}
        <div className="h-2 bg-gray-200 rounded-full">
          <div
            className="h-2 bg-blue-300 rounded-full transition-all duration-300 ease-in-out"
            style={{ width: `${percent}%` }}
          />
        </div>

        {/* Input Range */}
        <input
          type="range"
          step={step}
          min={min}
          max={max}
          value={value}
          onChange={handleChange}
          className="absolute top-0 left-0 w-full h-2 opacity-0 cursor-pointer"
        />

        {/* Thumb */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-blue-400 rounded-full shadow-md"
          initial={false}
          animate={{ left: `${percent}%` }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        />
      </div>

      {/* Value label */}
      <div className="text-center mt-2 text-sm text-gray-600">
        Value: <span className="font-medium text-blue-500">{value}</span>
      </div>
    </div>
  );
};

export default Slider;
