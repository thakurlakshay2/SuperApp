import React, { useState } from "react";
import clsx from "clsx";
interface SearchComponentProps {
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
}
const SearchComponent: React.FC<SearchComponentProps> = ({
  input,
  setInput,
}) => {
  const [isFocused, setIsFocused] = useState<boolean>(false);

  return (
    <div className="relative w-1/4 mb-4">
      <label className="flex items-center mb-2 text-indigo-700 text-sm font-medium">
        Search Coin
      </label>
      <input
        value={input}
        onChange={(change) => setInput(change.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        type="text"
        id="small-input"
        className={clsx(
          "block w-full max-w-xs px-3.5 py-2 text-sm font-normal shadow-xs text-gray-900 bg-indigo-50 border border-indigo-300 rounded-full placeholder-gray-400 focus:outline-none leading-relaxed transition-all duration-300 ease-in-out",
          {
            "bg-indigo-100 border-indigo-500 transform scale-105": isFocused,
            "bg-indigo-50 border-indigo-300": !isFocused,
          }
        )}
        placeholder="Type to search..."
      />
    </div>
  );
};

export default SearchComponent;
