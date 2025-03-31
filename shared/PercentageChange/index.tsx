import React, { useState, useEffect } from "react";
import clsx from "clsx";

interface PercentageChangeProps {
  initialPercentage: number;
  onPercentageChange: (newPercentage: number) => void;
}

const PercentageChange: React.FC<PercentageChangeProps> = ({
  initialPercentage,
  onPercentageChange,
}) => {
  const [percentage, setPercentage] = useState<number>(initialPercentage);
  const [prevPercentage, setPrevPercentage] =
    useState<number>(initialPercentage);

  useEffect(() => {
    if (percentage !== prevPercentage) {
      onPercentageChange(percentage);
      setPrevPercentage(percentage);
    }
  }, [percentage, prevPercentage, onPercentageChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      setPercentage(value);
    }
  };

  const increasePercentage = () => {
    setPercentage((prev) => prev + 5);
  };

  const decreasePercentage = () => {
    setPercentage((prev) => prev - 5);
  };
  return (
    <div className="flex items-center justify-center space-x-4">
      <button
        onClick={decreasePercentage}
        className="px-3 py-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
      >
        -
      </button>
      <div className="relative inline-flex items-center">
        <input
          type="number"
          value={percentage}
          onChange={handleInputChange}
          className="text-center w-20 outline-none bg-transparent"
        />
        <span className="ml-1">%</span>
      </div>
      <button
        onClick={increasePercentage}
        className="px-3 py-1 bg-green-500 text-white rounded-full hover:bg-green-600 transition"
      >
        +
      </button>
    </div>
  );
};

export default PercentageChange;
