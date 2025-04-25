"use client";

import { ReactNode, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/components/Button";
import { CalculatorCategory, calculatorCategories } from "../types";
import { motion } from "framer-motion";
import Link from "next/link";
import { getCategoryFromId } from "../helper";

export default function WarikooLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const category: CalculatorCategory = getCategoryFromId("warikoo");
  const gradient = calculatorCategories[category].gradient;
  const calculatorMap = calculatorCategories[category].calculators;
  const [isCalculatorSelected, setIsCalculatorSelected] =
    useState<boolean>(true);

  console.log("calculatorMap", calculatorMap);
  const [listWidthToggle, setListWithToggle] = useState<boolean>(true);
  // Check if we're on a specific calculator page
  useEffect(() => {
    const isSpecificCalculator = pathname.split("/").length > 3;
    setIsCalculatorSelected(isSpecificCalculator);
  }, [pathname]);

  return (
    <div
      key={"warikoocalcLayout"}
      className={cn(
        "w-full  px-6 py-8 transition-all duration-500 ease-in-out",
        "bg-gradient-to-br backdrop-blur-xl bg-opacity-20",
        gradient
      )}
    >
      <button
        onClick={() => router.back()}
        className="md:h-12 mb-6 px-4 py-2 rounded-lg shadow-md bg-white/30 text-gray-800 hover:bg-white/50 backdrop-blur-md transition-all"
      >
        ← Bassdack to Calculators
      </button>

      <div className="md:h-[58rem]  flex justify-center flex-col md:flex-row gap-4 w-full md:max-w-5/6 mx-auto">
        <motion.div
          initial={{ x: 0 }}
          animate={{
            width: isCalculatorSelected
              ? listWidthToggle
                ? "20%"
                : "33%"
              : "100%",
          }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="w-full md:w-1/3 overflow-auto rounded-2xl bg-white/70 p-6 shadow-xl backdrop-blur-lg"
        >
          <h2 className="text-xl font-bold mb-4 text-gray-800 flex justify-between">
            Calculators{" "}
            <span
              className="text-md font-regular text-sky-600 cursor-pointer"
              onClick={() => {
                setListWithToggle((prev) => !prev);
              }}
            >
              {listWidthToggle ? "=>" : "<="}
            </span>
          </h2>
          <div className="flex flex-col gap-4">
            {calculatorMap.map((calc, index) => {
              const isHighlighted = pathname.includes(calc.id);
              return (
                <Link key={calc.id} href={calc.path}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className={cn(
                      " rounded-2xl p-4 shadow-md backdrop-blur-md border border-white/30",
                      "hover:scale-[1.03] transition-transform duration-300 ease-out cursor-pointer",
                      isHighlighted
                        ? "bg-yellow-300 text-gray-900 font-semibold"
                        : "bg-indigo-100 text-gray-700 font-regular"
                    )}
                  >
                    <h3 className="truncate text-base font-semibold">
                      {calc.name}
                    </h3>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{
            opacity: isCalculatorSelected ? 1 : 0,
            x: isCalculatorSelected ? 0 : 100,
          }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={cn(
            "overflow-auto flex-1 rounded-2xl bg-white/70 p-6 shadow-xl backdrop-blur-lg",
            isCalculatorSelected ? "block" : "hidden"
          )}
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}
