import React from "react";
export interface RangeInputProps {
  value: number;
  onChange: (val: number) => void;
  color?: string;
}
const RangeInput: React.FC<RangeInputProps> = ({ value, onChange, color }) => {
  // Function to convert range value to gradient percentage
  const getGradient = (value) => {
    return `linear-gradient(to right, #d6bcfa ${value}%, #9f7aea ${value}%)`;
  };

  return (
    <div className="relative ">
      <input
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        className="w-full h-2 rounded-lg bg-transparent	cursor-pointer flex justify-end "
        style={
          color
            ? { accentColor: color }
            : {
                background: `linear-gradient(to right, #4f46e5 ${value}%, #d1d5db ${value}%)`,
                transition: "background 0.3s ease",
              }
        }
      />
      {/* <div
        className="w-fit bg-transparent	 absolute top-1/2 transform -translate-y-full right-0 mr-4 font-medium px-2 py-1 rounded"
        style={{
          left: `${Math.min(95, Math.max(5, value))}%`,
          transform: "translateX(-50%) translateY(-100%)",
          marginBottom: "8px",
        }}
      >
        {value.toFixed(2)}%
      </div> */}
    </div>
  );
};

export default RangeInput;
