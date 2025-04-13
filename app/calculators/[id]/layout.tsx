"use client";

import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/components/Button";
import { CalculatorCategory, calculatorCategories } from "../types";
import { motion } from "framer-motion";
import Link from "next/link";

// const categoryColors: Record<CalculatorCategory, string> = {
//   [CalculatorCategory.Investment]: "from-blue-100 to-indigo-200",
//   [CalculatorCategory.Loan]: "from-red-100 to-pink-200",
//   [CalculatorCategory.Savings]: "from-green-100 to-teal-200",
//   [CalculatorCategory.Tax]: "from-yellow-100 to-orange-200",
//   [CalculatorCategory.Retirement]: "from-purple-100 to-violet-200",
//   [CalculatorCategory.Insurance]: "from-pink-100 to-red-200",
//   [CalculatorCategory.Miscellaneous]: "from-gray-100 to-slate-200",
// };

export function getCategoryFromId(id: string): CalculatorCategory {
  const lowerId = id.toLowerCase();
  if (lowerId.includes("investment")) return CalculatorCategory.Investment;
  if (lowerId.includes("loan")) return CalculatorCategory.Loan;
  if (lowerId.includes("saving")) return CalculatorCategory.Savings;
  if (lowerId.includes("tax")) return CalculatorCategory.Tax;
  if (lowerId.includes("retirement")) return CalculatorCategory.Retirement;
  if (lowerId.includes("insurance")) return CalculatorCategory.Insurance;
  return CalculatorCategory.Miscellaneous;
}

export default function CalculatorLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { id: string };
}) {
  const router = useRouter();
  const category: CalculatorCategory = getCategoryFromId(params.id);
  const gradient = calculatorCategories[category].gradient;
  const calculatorMap = calculatorCategories[category].calculators;

  return (
    <div
      key={params.id + "calcLayout"}
      className={cn(
        "w-full justify-center min-h-screen px-6 py-8 transition-all duration-500 ease-in-out",
        "bg-gradient-to-br backdrop-blur-xl",
        gradient
      )}
    >
      <button
        onClick={() => router.back()}
        className="mb-6 px-4 py-2 rounded-lg shadow-md bg-white/30 text-gray-800 hover:bg-white/50 backdrop-blur-md transition-all"
      >
        ← Back to Calculators
      </button>

      <div className="md:flex  md:w-full justify-between  mx-auto rounded-2xl bg-white/70 p-6 shadow-xl backdrop-blur-lg">
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          {calculatorMap.map((calc, index) => {
            const isHighlighted = calc.name.toLowerCase();

            return (
              <Link key={calc.id} href={calc.path}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className={cn(
                    "rounded-2xl p-4 shadow-md backdrop-blur-md border border-white/30",
                    "hover:scale-[1.03] transition-transform duration-300 ease-out cursor-pointer",
                    isHighlighted
                      ? "bg-yellow-300 text-gray-900 font-semibold"
                      : "bg-white/20 text-white"
                  )}
                >
                  <h3 className="text-base font-semibold">{calc.name}</h3>
                </motion.div>
              </Link>
            );
          })}
        </div>
        {children}
      </div>
    </div>
  );
}
