"use client";
import React, { useState } from "react";
import { Search } from "lucide-react";

const AnimatedSearch = () => {
  const [isFocused, setIsFocused] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = () => {
    console.log("Searching for:", searchValue);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-md p-6">
        <div
          className={`
            flex items-center gap-2 p-3 bg-white rounded-xl shadow-lg
            transition-all duration-300 ease-in-out
            ${
              isFocused
                ? "ring-2 ring-blue-400 shadow-xl translate-y-[-2px]"
                : ""
            }
            hover:shadow-xl hover:translate-y-[-2px]
          `}
        >
          <input
            type="text"
            placeholder="Search anything..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyPress={handleKeyPress}
            className="
              flex-1 outline-none text-gray-700 text-lg
              transition-all duration-300
              placeholder:text-gray-400
              focus:placeholder:opacity-70
            "
          />
          <button
            onClick={handleSearch}
            className="
              p-2 rounded-lg bg-blue-500 text-white
              transition-all duration-300
              hover:bg-blue-600 active:scale-95
              disabled:opacity-50 disabled:cursor-not-allowed
            "
            disabled={!searchValue.trim()}
          >
            <Search className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnimatedSearch;
