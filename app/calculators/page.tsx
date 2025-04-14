"use client";
import { cn } from "@/components/Button";
import { useState, Suspense, lazy, memo, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  CalculatorCategory,
  CalculatorCategoryData,
  calculatorCategories,
} from "./types";
import { debounce } from "lodash";

// Lazy load the calculator modal
const CalculatorModal = lazy(() => import("./CalculatorModal"));

const CategoryCard = memo(
  ({
    category,
    data,
    onClick,
  }: {
    category: string;
    data: CalculatorCategoryData;
    onClick: () => void;
  }) => (
    <motion.div
      onClick={onClick}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: Math.random() * 0.5 }}
      className={cn(
        "cursor-pointer rounded-2xl p-6 shadow-lg backdrop-blur-md border border-white/30",
        "hover:scale-105 transform transition duration-300 ease-in-out text-white",
        `bg-gradient-to-br ${data.gradient}`
      )}
    >
      <h2 className="text-xl font-semibold mb-4 drop-shadow-md">
        <Link href={`/calculators/${category.toLowerCase()}`}>{data.name}</Link>
      </h2>
      <ul className="space-y-2 text-sm opacity-80">
        {data.calculators.slice(0, 5).map((calc) => (
          <li
            key={calc.id}
            className="bg-white/20 rounded-md px-3 py-1 backdrop-blur-sm"
          >
            {calc.name}
          </li>
        ))}
        {data.calculators.length > 5 && (
          <li className="italic">+ {data.calculators.length - 5} more…</li>
        )}
      </ul>
    </motion.div>
  )
);

CategoryCard.displayName = "CategoryCard";

export default function CalculatorsPage() {
  const [activeCategory, setActiveCategory] =
    useState<CalculatorCategory | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Memoize the filtered categories to prevent unnecessary recalculations
  const filteredCategories = useMemo(
    () =>
      Object.entries(calculatorCategories).filter(
        ([category, data]) =>
          category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          data.calculators.some((calc) =>
            calc.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
      ),
    [searchTerm]
  );

  // Debounce the search input
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setSearchTerm(value);
    }, 300),
    []
  );

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-4xl font-bold text-center mb-8 text-blue-950 drop-shadow-md">
        All Financial Calculators
      </h1>
      <div className="max-w-xl mx-auto mb-8">
        <input
          type="text"
          placeholder="Search calculator..."
          onChange={(e) => debouncedSearch(e.target.value)}
          className="w-full px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white/60 backdrop-blur-md text-gray-800 placeholder:text-gray-500"
        />
      </div>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {filteredCategories.map(([category, data]) => (
          <CategoryCard
            key={category}
            category={category}
            data={data}
            onClick={() => setActiveCategory(category as CalculatorCategory)}
          />
        ))}
      </div>

      <AnimatePresence>
        {activeCategory && (
          <Suspense
            fallback={
              <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            }
          >
            <CalculatorModal
              category={activeCategory}
              onClose={() => setActiveCategory(null)}
            />
          </Suspense>
        )}
      </AnimatePresence>
    </div>
  );
}
