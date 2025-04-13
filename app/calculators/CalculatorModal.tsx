import { motion } from "framer-motion";
import { cn } from "@/components/Button";
import { CalculatorCategory, calculatorCategories } from "./types";
import Link from "next/link";

interface CalculatorModalProps {
  category: CalculatorCategory;
  onClose: () => void;
}

export default function CalculatorModal({
  category,
  onClose,
}: CalculatorModalProps) {
  const categoryData = calculatorCategories[category];

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-3xl p-8 shadow-2xl",
          "bg-white text-gray-900 backdrop-blur-lg border border-gray-300",
          `bg-gradient-to-br ${categoryData.gradient}`
        )}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-3xl font-bold mb-6 text-white drop-shadow-md text-center">
          {category}
        </h2>
        <ul className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          {categoryData.calculators.map((calc) => (
            <li
              key={calc.id}
              className="bg-white/30 text-white rounded-xl px-4 py-3 font-medium backdrop-blur-sm hover:bg-white/40 transition shadow-sm"
            >
              <Link href={calc.path}>{calc.name}</Link>
            </li>
          ))}
        </ul>
      </motion.div>
    </motion.div>
  );
}
