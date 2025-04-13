import { notFound } from "next/navigation";

const calculators = [
  "SIP Calculator",
  "SWP Calculator",
  "Lumpsum Investment Calculator",
  "Mutual Fund Return Calculator",
  "Wealth Accumulation Calculator",
  "Goal-Based Investment Calculator",
  "Recurring Deposit (RD) Calculator",
  "Fixed Deposit (FD) Calculator",
  "PPF Calculator",
  "ELSS Tax Saving Calculator",
  "Gold Investment Calculator",
  "Stock Return Calculator",
  "Real Estate Investment Calculator",
  "ULIP Calculator",
  "Home Loan EMI Calculator",
  "Car Loan EMI Calculator",
  "Personal Loan EMI Calculator",
  "Education Loan EMI Calculator",
  "Loan Prepayment Calculator",
  "Loan Eligibility Calculator",
  "Balance Transfer Calculator",
  "Interest-only EMI Calculator",
  "Business Loan Calculator",
  "Compound Interest Calculator",
  "Simple Interest Calculator",
  "Wealth Growth Calculator",
  "Emergency Fund Calculator",
  "Savings Goal Calculator",
  "Net Worth Calculator",
  "Retirement Corpus Calculator",
  "Income Tax Calculator",
  "HRA Exemption Calculator",
  "Gratuity Calculator",
  "Salary Breakup Calculator",
  "Post-Tax Return Calculator",
  "Capital Gains Tax Calculator",
  "Advance Tax Calculator",
  "Retirement Calculator",
  "Pension Calculator",
  "Annuity Calculator",
  "Inflation-adjusted Retirement Calculator",
  "Post-retirement Income Calculator",
  "Term Insurance Premium Calculator",
  "Life Insurance Need Calculator",
  "Health Insurance Premium Calculator",
  "Motor Insurance Premium Calculator",
  "Inflation Impact Calculator",
  "Real Return Calculator",
  "Currency Exchange Calculator",
  "Purchasing Power Calculator",
];

export default function CalculatorPage({
  params,
}: {
  params: { route: string };
}) {
  const decodedId = decodeURIComponent(params.route).replace(/-/g, " ");
  console.log(decodedId);
  const matched = calculators.find(
    (name) => name.toLowerCase() === decodedId.toLowerCase()
  );

  // if (!matched) {
  //   notFound();
  // }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">{matched}</h1>
    </div>
  );
}
