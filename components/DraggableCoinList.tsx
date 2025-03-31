"use client"; // Ensure this is a Client Component

import axios from "axios";
import Image from "next/image";
import React, { DragEvent, useState } from "react";
import Draggable from "react-draggable";

interface Token {
  id: string;
  name: string;
  symbol: string;
  image: string;
}

const DraggableCoinLists: React.FC = () => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [watchlist, setWatchlist] = useState<Token[]>([]);

  // Fetch tokens (similar to the previous implementation)
  const fetchTokens = async () => {
    try {
      const response = await axios.get(
        "https://api.coingecko.com/api/v3/coins/list"
      );
      const tokens = response.data.slice(0, 10).map((token: any) => ({
        id: token.id,
        name: token.name,
        symbol: token.symbol,
        image: token.image,
      }));
      setTokens(tokens);
    } catch (error) {
      console.error("Error fetching tokens:", error);
    }
  };

  // Initialize tokens on mount
  React.useEffect(() => {
    fetchTokens();
  }, []);

  const handleDrop = (e: DragEvent<HTMLDivElement>, token: Token) => {
    e.preventDefault();
    if (!watchlist.find((item) => item.id === token.id)) {
      setWatchlist((prevWatchlist) => [...prevWatchlist, token]);
    }
  };

  const handleDragStart = (e: DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData("text/plain", e.currentTarget.id);
  };

  return (
    <div className="flex space-x-4 p-4">
      {/* Draggable Coins List */}
      <div className="w-1/2 bg-gray-100 p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Available Coins</h2>
        <div className="space-y-4">
          {tokens.map((token) => (
            <Draggable
              key={token.id}
              onStart={(e) => handleDragStart(e as DragEvent<HTMLDivElement>)}
            >
              <div
                id={token.id}
                draggable
                onDragStart={(e) =>
                  handleDragStart(e as DragEvent<HTMLDivElement>)
                }
                className="flex items-center space-x-4 cursor-pointer p-2 bg-white border border-gray-300 rounded-lg shadow-sm"
              >
                <Image
                  src={token.image}
                  alt={token.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div>
                  <h3 className="text-lg font-semibold">{token.name}</h3>
                  <p className="text-gray-600">{token.symbol.toUpperCase()}</p>
                </div>
              </div>
            </Draggable>
          ))}
        </div>
      </div>

      {/* Drop Area List */}
      <div
        className="w-1/2 bg-gray-100 p-4 rounded-lg shadow-md"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          const id = e.dataTransfer.getData("text/plain");
          const token = tokens.find((t) => t.id === id);
          if (token) handleDrop(e as DragEvent<HTMLDivElement>, token);
        }}
      >
        <h2 className="text-xl font-bold mb-4">Watchlist</h2>
        <div className="space-y-4">
          {watchlist.map((token) => (
            <div
              key={token.id}
              className="flex items-center space-x-4 p-2 bg-white border border-gray-300 rounded-lg shadow-sm"
            >
              <Image
                src={token.image}
                alt={token.name}
                width={40}
                height={40}
                className="rounded-full"
              />
              <div>
                <h3 className="text-lg font-semibold">{token.name}</h3>
                <p className="text-gray-600">{token.symbol.toUpperCase()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DraggableCoinLists;
