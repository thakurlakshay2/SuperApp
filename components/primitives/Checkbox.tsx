import { AnimatePresence, motion } from "framer-motion";
import React from "react";

interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

const Checkbox: React.FC<CheckboxProps> = ({
  label,
  checked,
  onChange,
  disabled = false,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.checked);
  };

  return (
    <label className="flex items-center space-x-2 cursor-pointer">
      <motion.div
        className="relative"
        initial="unchecked"
        animate={checked ? "checked" : "unchecked"}
        whileTap={{ scale: 1.2 }}
      >
        <input
          type="checkbox"
          className="form-checkbox h-5 w-5 text-blue-600 border-gray-300 rounded opacity-0 absolute inset-0"
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
        />
        <motion.div
          className={`h-5 w-5 border-2 ${
            checked ? "border-blue-600" : "border-gray-300"
          } rounded flex items-center justify-center`}
        >
          <AnimatePresence>
            {checked && (
              <motion.svg
                key="check"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 text-blue-600"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <polyline points="20 6 9 17 4 12" />
              </motion.svg>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
      <motion.span
        className={`text-sm ${disabled ? "text-gray-400" : "text-gray-900"}`}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        {label}
      </motion.span>
    </label>
  );
};

export default Checkbox;
