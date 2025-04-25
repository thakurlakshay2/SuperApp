import { CalculatorCategory } from "./types";

export function getCategoryFromId(id: string): CalculatorCategory {
  const lowerId = id.toLowerCase();
  if (lowerId.includes("warikoo")) return CalculatorCategory.Warikoo;
  if (lowerId.includes("investment")) return CalculatorCategory.Investment;
  if (lowerId.includes("loan")) return CalculatorCategory.Loan;
  if (lowerId.includes("saving")) return CalculatorCategory.Savings;
  if (lowerId.includes("tax")) return CalculatorCategory.Tax;
  if (lowerId.includes("retirement")) return CalculatorCategory.Retirement;
  if (lowerId.includes("insurance")) return CalculatorCategory.Insurance;
  return CalculatorCategory.Miscellaneous;
}
