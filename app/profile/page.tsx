"use client";
import { Search, X } from "lucide-react";
import Header from "@/components/Header";
import { Metadata } from "next";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const [searchValue, setSearchValue] = useState("");
  const router = useRouter();

  const handleClear = () => setSearchValue("");
  const handleSearch = () => {
    router.push(`/profile/${searchValue}`);
  };

  return (
    <main className=" m-auto	 flex min-h-screen flex-col items-center px-24 py-8">
      <Header />
      <div className="min-h-screen  flex items-center justify-center ">
        <div className="w-full max-w-lg space-y-8 text-center">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-gray-900">
              Oops! You forgot to add an ID
            </h1>
            <p className="text-xl text-gray-600">
              Please enter one to get Profile Info
            </p>
          </div>

          <div className="space-y-4">
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Enter ID..."
              className="w-full px-4 py-3 text-lg rounded-xl border border-gray-200 
                     shadow-sm transition-all duration-200
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     hover:border-gray-300"
            />

            <div className="flex gap-4 justify-center">
              <button
                onClick={handleClear}
                className="px-6 py-3 rounded-xl bg-gray-900 text-white font-medium
                       flex items-center gap-2 transition-all duration-200
                       hover:bg-gray-800 active:scale-95"
              >
                <X size={20} />
                Clear
              </button>

              <button
                onClick={handleSearch}
                className="px-6 py-3 rounded-xl bg-blue-500 text-white font-medium
                       flex items-center gap-2 transition-all duration-200
                       hover:bg-blue-600 active:scale-95"
              >
                <Search size={20} />
                Search
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
