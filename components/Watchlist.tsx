"use client"; // Ensure this is a Client Component

import { useSpring } from "@react-spring/web";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";
import { FaPlus } from "react-icons/fa";

interface Token {
  id: string;
  name: string;
  symbol: string;
  image?: string;
}

export default function AnimatedTokenPlane() {
  const [searchTerm, setSearchTerm] = useState("");
  const [tokens, setTokens] = useState<Token[]>([]);
  const [watchlist, setWatchlist] = useState<Token[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Handle search token fetching
  const fetchTokens = async (term: string) => {
    if (!term) {
      setTokens([]);
      return;
    }

    try {
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/coins/markets`,
        {
          params: {
            vs_currency: "usd",
            ids: term, // Assumes search term is a comma-separated list of token IDs
          },
        }
      );
      setTokens(response.data);
    } catch (error) {
      console.error("Error fetching tokens:", error);
    }
  };

  // Handle search button click
  const handleSearchClick = () => {
    fetchTokens(searchTerm);
    setIsDropdownOpen(true); // Open the dropdown on search
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const addToWatchlist = (token: Token) => {
    setWatchlist((prevWatchlist) => [...prevWatchlist, token]);
    setSearchTerm("");
    setTokens([]);
    setIsDropdownOpen(false); // Close the dropdown after adding to watchlist
  };

  const removeFromWatchlist = (id: string) => {
    setWatchlist((prevWatchlist) =>
      prevWatchlist.filter((token) => token.id !== id)
    );
  };

  // Close dropdown if clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as HTMLElement).closest(".dropdown")) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Framer Motion animation settings
  const [springs] = useSpring(() => ({
    from: { x: 0, y: 0 },
    to: async (next) => {
      while (true) {
        await next({ x: Math.random() * 100, y: Math.random() * 100 });
      }
    },
    config: { mass: 1, tension: 200, friction: 20 },
  }));

  const [sst, setsst] = useState(0);

  useEffect(() => {
    const x = setInterval(() => {
      return setsst((x) => x + 1);
    }, 2000);

    return () => {
      clearInterval(x);
    };
  }, []);

  const newLocal = useMemo(() => {
    return watchlist.map((token) => (
      <motion.div
        initial={{ x: "50%", y: "50%" }}
        animate={{
          x: `${(Math.random() + Math.random()) * 150}%`,
          y: `${(Math.random() + Math.random()) * 350}%`,
        }}
        key={token.id}
        className="absolute"
        style={{
          width: "50px",
          height: "50px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {token.image && (
          <Image src={token.image} alt={token.name} width={50} height={50} />
        )}
      </motion.div>
    ));
  }, [watchlist, sst]);
  return (
    <div className="relative p-4 bg-white shadow-md rounded-lg">
      <div className="flex flex-col mb-6">
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          placeholder="Enter token name..."
          className="border border-gray-300 rounded-lg px-3 py-2 w-full mb-2"
        />
        <button
          onClick={handleSearchClick}
          className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
        >
          Search
        </button>
      </div>

      <div className=" w-full h-96 overflow-hidden">{newLocal}</div>

      {/* Dropdown for search results */}
      <AnimatePresence>
        {isDropdownOpen && tokens.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-10 dropdown"
          >
            <ul>
              {tokens.map((token) => (
                <motion.li
                  key={token.id}
                  className="flex justify-between items-center px-4 py-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => addToWatchlist(token)}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  {token.image && (
                    <Image
                      width={25}
                      height={25}
                      src={token.image}
                      alt={token.name}
                    />
                  )}
                  <div>
                    <h3 className="text-lg font-semibold">
                      {token.symbol.toUpperCase()}
                    </h3>
                    <p className="text-gray-600">{token.name}</p>
                  </div>
                  <FaPlus className="w-5 h-5 cursor-pointer hover:text-green-700" />
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
