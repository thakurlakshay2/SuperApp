export enum CalculatorCategory {
  Investment = "Investment",
  Loan = "Loan",
  Savings = "Savings",
  Tax = "Tax",
  Retirement = "Retirement",
  Insurance = "Insurance",
  Miscellaneous = "Miscellaneous",
}

export interface CalculatorItem {
  id: string;
  name: string;
  category: CalculatorCategory;
  path: string;
}

export interface CalculatorCategoryData {
  name: CalculatorCategory;
  calculators: CalculatorItem[];
  gradient: string;
}
export const calculatorCategories: Record<
  CalculatorCategory,
  CalculatorCategoryData
> = {
  [CalculatorCategory.Investment]: {
    name: CalculatorCategory.Investment,
    calculators: [
      {
        id: "sip",
        name: "SIP Calculator",
        category: CalculatorCategory.Investment,
        path: "/calculators/investment/sip",
      },
      {
        id: "swp",
        name: "SWP Calculator",
        category: CalculatorCategory.Investment,
        path: "/calculators/investment/swp",
      },
      {
        id: "lumpsum",
        name: "Lumpsum Investment Calculator",
        category: CalculatorCategory.Investment,
        path: "/calculators/investment/lumpsum",
      },
      {
        id: "mutual-fund",
        name: "Mutual Fund Return Calculator",
        category: CalculatorCategory.Investment,
        path: "/calculators/investment/mutual-fund",
      },
      {
        id: "wealth-accumulation",
        name: "Wealth Accumulation Calculator",
        category: CalculatorCategory.Investment,
        path: "/calculators/investment/wealth-accumulation",
      },
      {
        id: "goal-based-investment",
        name: "Goal-Based Investment Calculator",
        category: CalculatorCategory.Investment,
        path: "/calculators/investment/goal-based-investment",
      },
      {
        id: "rd",
        name: "Recurring Deposit (RD) Calculator",
        category: CalculatorCategory.Investment,
        path: "/calculators/investment/rd",
      },
      {
        id: "fd",
        name: "Fixed Deposit (FD) Calculator",
        category: CalculatorCategory.Investment,
        path: "/calculators/investment/fd",
      },
      {
        id: "ppf",
        name: "PPF Calculator",
        category: CalculatorCategory.Investment,
        path: "/calculators/investment/ppf",
      },
      {
        id: "elss",
        name: "ELSS Tax Saving Calculator",
        category: CalculatorCategory.Investment,
        path: "/calculators/investment/elss",
      },
      {
        id: "gold",
        name: "Gold Investment Calculator",
        category: CalculatorCategory.Investment,
        path: "/calculators/investment/gold",
      },
      {
        id: "stock-return",
        name: "Stock Return Calculator",
        category: CalculatorCategory.Investment,
        path: "/calculators/investment/stock-return",
      },
      {
        id: "real-estate",
        name: "Real Estate Investment Calculator",
        category: CalculatorCategory.Investment,
        path: "/calculators/investment/real-estate",
      },
      {
        id: "ulip",
        name: "ULIP Calculator",
        category: CalculatorCategory.Investment,
        path: "/calculators/investment/ulip",
      },
    ],
    gradient: "from-blue-400 to-indigo-600",
  },
  [CalculatorCategory.Loan]: {
    name: CalculatorCategory.Loan,
    calculators: [
      {
        id: "home-loan",
        name: "Home Loan EMI Calculator",
        category: CalculatorCategory.Loan,
        path: "/calculators/loan/home-loan",
      },
      {
        id: "car-loan",
        name: "Car Loan EMI Calculator",
        category: CalculatorCategory.Loan,
        path: "/calculators/loan/car-loan",
      },
      {
        id: "personal-loan",
        name: "Personal Loan EMI Calculator",
        category: CalculatorCategory.Loan,
        path: "/calculators/loan/personal-loan",
      },
      {
        id: "education-loan",
        name: "Education Loan EMI Calculator",
        category: CalculatorCategory.Loan,
        path: "/calculators/loan/education-loan",
      },
      {
        id: "loan-prepayment",
        name: "Loan Prepayment Calculator",
        category: CalculatorCategory.Loan,
        path: "/calculators/loan/loan-prepayment",
      },
      {
        id: "loan-eligibility",
        name: "Loan Eligibility Calculator",
        category: CalculatorCategory.Loan,
        path: "/calculators/loan/loan-eligibility",
      },
      {
        id: "balance-transfer",
        name: "Balance Transfer Calculator",
        category: CalculatorCategory.Loan,
        path: "/calculators/loan/balance-transfer",
      },
      {
        id: "emi-only",
        name: "Interest-only EMI Calculator",
        category: CalculatorCategory.Loan,
        path: "/calculators/loan/emi-only",
      },
      {
        id: "business-loan",
        name: "Business Loan Calculator",
        category: CalculatorCategory.Loan,
        path: "/calculators/loan/business-loan",
      },
    ],
    gradient: "from-red-400 to-pink-600",
  },
  [CalculatorCategory.Savings]: {
    name: CalculatorCategory.Savings,
    calculators: [
      {
        id: "compound-interest",
        name: "Compound Interest Calculator",
        category: CalculatorCategory.Savings,
        path: "/calculators/savings/compound-interest",
      },
      {
        id: "simple-interest",
        name: "Simple Interest Calculator",
        category: CalculatorCategory.Savings,
        path: "/calculators/savings/simple-interest",
      },
      {
        id: "wealth-growth",
        name: "Wealth Growth Calculator",
        category: CalculatorCategory.Savings,
        path: "/calculators/savings/wealth-growth",
      },
      {
        id: "emergency-fund",
        name: "Emergency Fund Calculator",
        category: CalculatorCategory.Savings,
        path: "/calculators/savings/emergency-fund",
      },
      {
        id: "savings-goal",
        name: "Savings Goal Calculator",
        category: CalculatorCategory.Savings,
        path: "/calculators/savings/savings-goal",
      },
      {
        id: "net-worth",
        name: "Net Worth Calculator",
        category: CalculatorCategory.Savings,
        path: "/calculators/savings/net-worth",
      },
      {
        id: "retirement-corpus",
        name: "Retirement Corpus Calculator",
        category: CalculatorCategory.Savings,
        path: "/calculators/savings/retirement-corpus",
      },
    ],
    gradient: "from-green-400 to-teal-600",
  },
  [CalculatorCategory.Tax]: {
    name: CalculatorCategory.Tax,
    calculators: [
      {
        id: "income-tax",
        name: "Income Tax Calculator",
        category: CalculatorCategory.Tax,
        path: "/calculators/tax/income-tax",
      },
      {
        id: "hra",
        name: "HRA Exemption Calculator",
        category: CalculatorCategory.Tax,
        path: "/calculators/tax/hra",
      },
      {
        id: "gratuity",
        name: "Gratuity Calculator",
        category: CalculatorCategory.Tax,
        path: "/calculators/tax/gratuity",
      },
      {
        id: "salary-breakup",
        name: "Salary Breakup Calculator",
        category: CalculatorCategory.Tax,
        path: "/calculators/tax/salary-breakup",
      },
      {
        id: "post-tax-return",
        name: "Post-Tax Return Calculator",
        category: CalculatorCategory.Tax,
        path: "/calculators/tax/post-tax-return",
      },
      {
        id: "capital-gains",
        name: "Capital Gains Tax Calculator",
        category: CalculatorCategory.Tax,
        path: "/calculators/tax/capital-gains",
      },
      {
        id: "advance-tax",
        name: "Advance Tax Calculator",
        category: CalculatorCategory.Tax,
        path: "/calculators/tax/advance-tax",
      },
    ],
    gradient: "from-yellow-400 to-orange-600",
  },
  [CalculatorCategory.Retirement]: {
    name: CalculatorCategory.Retirement,
    calculators: [
      {
        id: "retirement",
        name: "Retirement Calculator",
        category: CalculatorCategory.Retirement,
        path: "/calculators/retirement/retirement",
      },
      {
        id: "pension",
        name: "Pension Calculator",
        category: CalculatorCategory.Retirement,
        path: "/calculators/retirement/pension",
      },
      {
        id: "annuity",
        name: "Annuity Calculator",
        category: CalculatorCategory.Retirement,
        path: "/calculators/retirement/annuity",
      },
      {
        id: "inflation-adjusted",
        name: "Inflation-adjusted Retirement Calculator",
        category: CalculatorCategory.Retirement,
        path: "/calculators/retirement/inflation-adjusted",
      },
      {
        id: "post-retirement",
        name: "Post-retirement Income Calculator",
        category: CalculatorCategory.Retirement,
        path: "/calculators/retirement/post-retirement",
      },
    ],
    gradient: "from-purple-400 to-violet-600",
  },
  [CalculatorCategory.Insurance]: {
    name: CalculatorCategory.Insurance,
    calculators: [
      {
        id: "term-insurance",
        name: "Term Insurance Premium Calculator",
        category: CalculatorCategory.Insurance,
        path: "/calculators/insurance/term-insurance",
      },
      {
        id: "life-insurance",
        name: "Life Insurance Need Calculator",
        category: CalculatorCategory.Insurance,
        path: "/calculators/insurance/life-insurance",
      },
      {
        id: "health-insurance",
        name: "Health Insurance Premium Calculator",
        category: CalculatorCategory.Insurance,
        path: "/calculators/insurance/health-insurance",
      },
      {
        id: "motor-insurance",
        name: "Motor Insurance Premium Calculator",
        category: CalculatorCategory.Insurance,
        path: "/calculators/insurance/motor-insurance",
      },
    ],
    gradient: "from-pink-400 to-red-600",
  },
  [CalculatorCategory.Miscellaneous]: {
    name: CalculatorCategory.Miscellaneous,
    calculators: [
      {
        id: "inflation",
        name: "Inflation Impact Calculator",
        category: CalculatorCategory.Miscellaneous,
        path: "/calculators/miscellaneous/inflation",
      },
      {
        id: "real-return",
        name: "Real Return Calculator",
        category: CalculatorCategory.Miscellaneous,
        path: "/calculators/miscellaneous/real-return",
      },
      {
        id: "currency",
        name: "Currency Exchange Calculator",
        category: CalculatorCategory.Miscellaneous,
        path: "/calculators/miscellaneous/currency",
      },
      {
        id: "purchasing-power",
        name: "Purchasing Power Calculator",
        category: CalculatorCategory.Miscellaneous,
        path: "/calculators/miscellaneous/purchasing-power",
      },
    ],
    gradient: "from-gray-400 to-slate-600",
  },
};

const categoryColors: Record<string, string> = {
  investment: "from-blue-100 to-indigo-200",
  loan: "from-red-100 to-pink-200",
  savings: "from-green-100 to-teal-200",
  tax: "from-yellow-100 to-orange-200",
  retirement: "from-purple-100 to-violet-200",
  insurance: "from-pink-100 to-red-200",
  miscellaneous: "from-gray-100 to-slate-200",
};
