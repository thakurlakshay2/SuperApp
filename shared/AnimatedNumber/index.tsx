import React, { useState, useEffect } from "react";
import clsx from "clsx";

interface AnimatedNumberProps {
  value: number;
}

const AnimatedNumber: React.FC<AnimatedNumberProps> = ({ value }) => {
  const [displayValue, setDisplayValue] = useState<number>(value);
  const [animating, setAnimating] = useState<boolean>(false);
  const [direction, setDirection] = useState<"up" | "down">("up");

  useEffect(() => {
    if (value !== displayValue) {
      setDirection(value > displayValue ? "up" : "down");
      setAnimating(true);

      const timeout = setTimeout(() => {
        setAnimating(false);
        setDisplayValue(value);
      }, 300);

      return () => clearTimeout(timeout);
    }
  }, [value, displayValue]);

  return (
    <div className="relative inline-flex items-center justify-center w-4 h-4 ml-2 text-xs font-semibold text-indigo-800 bg-indigo-200 rounded-full overflow-hidden">
      <div
        className={clsx(
          "absolute  flex items-center justify-center transition-transform duration-300",
          {
            // "translate-y-0": !animating,
            "-translate-y-full": animating && direction === "up",
            "translate-y-full": animating && direction === "down",
          }
        )}
      >
        {displayValue}
      </div>
      {/* <div
        className={clsx(
          "absolute inset-0 flex items-center justify-center transition-transform duration-300",
          {
            "translate-y-full": !animating && direction === "up",
            "-translate-y-full": !animating && direction === "down",
            "translate-y-0": animating,
          }
        )}
      >
        {value}
      </div> */}
    </div>
  );
};

export default AnimatedNumber;
