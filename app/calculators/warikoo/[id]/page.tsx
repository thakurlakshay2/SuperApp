"use client";

import { useState, useEffect } from "react";
import { evaluate } from "mathjs";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

import formatCurrency from "@/utils/formatCurrency";

import { warikooData } from "../../[id]/dummyData";
import InflationAdjuster from "@/components/InflationAdjuster.tsx";

// Currency configuration for display.
const currencyConfig = {
  currency: "₹",
  locale: "en-IN",
  compact: true,
  decimals: 2,
};

export default function LiabilityCalculator({
  params,
}: {
  params: { id: string };
}) {
  // Base info holds the default values from our warikooData.
  const [baseInfo, setBaseInfo] = useState<Record<string, number>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [liabilityData, setLiabilityData] = useState<any>(null);
  const [inflation, setInflation] = useState<number>(0);
  const [isInflationEnabled, setIsInflationEnabled] = useState<boolean>(false);

  // Populate the base information from the data config.
  useEffect(() => {
    const info: Record<string, number> = {};
    warikooData[params.id]?.inputs.forEach((input) => {
      info[input.id] = input.default;
    });
    setBaseInfo(info);
  }, [params.id]);

  // Helper: Checks if any error message string exists.
  function hasNonEmptyStringValue(obj: Record<string, string>) {
    return Object.values(obj).some((val) => val && val !== "");
  }

  useEffect(() => {
    if (baseInfo && !hasNonEmptyStringValue(errors)) {
      calculateLiability();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseInfo, inflation, isInflationEnabled]);

  // Validate input ranges.
  const validateInput = (id: string, value: number) => {
    const inputMeta = warikooData[params.id]?.inputs.find(
      (input) => input.id === id
    );
    if (!inputMeta) return;
    let error = "";

    if (
      inputMeta.required &&
      (value === null ||
        value === undefined ||
        value < inputMeta.min ||
        value > inputMeta.max)
    ) {
      error = inputMeta.errorMessage;
    }
    setErrors((prev) => ({ ...prev, [id]: error }));
  };

  // Calculate liability details.
  // For this example, we assume the following fields (from warikooData):
  // - vehicleCost: Total on-road price / cost of the item.
  // - monthlyIncome: User's monthly salary after tax.
  // - downPayment: Optional; if not provided, assume 20% of cost.
  // - loanTenure: In years (optional; default 4 years).
  // - interestRate: Annual interest rate for the loan.
  const calculateLiability = () => {
    if (!baseInfo) return;
    // Read inputs with fallbacks
    const cost = baseInfo["vehicleCost"];
    const monthlyIncome = baseInfo["monthlyIncome"];
    const downPayment = baseInfo["downPayment"] || cost * 0.2;
    const loanTenureYears = baseInfo["loanTenure"] || 4;
    const interestRate = baseInfo["interestRate"] || 9;

    // Calculate loan principal
    const principal = cost - downPayment;
    // Monthly interest rate.
    const r = interestRate / 12 / 100;
    const totalMonths = loanTenureYears * 12;

    // Use mathjs evaluate to compute EMI:
    // EMI = P * r * (1+r)^n / ((1+r)^n - 1)
    const EMI = evaluate("P * r * (1 + r) ^ n / ((1 + r) ^ n - 1)", {
      P: principal,
      r,
      n: totalMonths,
    });

    // Maximum affordable EMI based on 10% rule.
    const maxAffordableEMI = monthlyIncome * 0.1;
    const isEmiValid = EMI <= maxAffordableEMI;

    // Compute cumulative liability over each year.
    // We'll chart from year 0 to loanTenureYears.
    const labels: number[] = [];
    const cumulativeLiability: number[] = [];
    const realCumulativeLiability: number[] = [];

    // Start with the down payment already paid.
    let cumulative = downPayment;
    labels.push(0);
    cumulativeLiability.push(cumulative);
    realCumulativeLiability.push(cumulative); // At time 0, inflation factor = 1

    for (let year = 1; year <= loanTenureYears; year++) {
      // For each year, add 12 months of EMI, or if the remaining months are fewer than 12,
      // adjust accordingly.
      let monthsToAdd = 12;
      if (year * 12 > totalMonths) {
        monthsToAdd = totalMonths % 12;
      }
      cumulative += EMI * monthsToAdd;
      labels.push(year);
      cumulativeLiability.push(cumulative);

      // Adjust for inflation if enabled:
      // Here, we discount the nominal cumulative cost by the inflation factor:
      const inflationFactor = Math.pow(
        1 + (isInflationEnabled ? inflation / 100 : 0),
        year
      );
      realCumulativeLiability.push(cumulative / inflationFactor);
    }

    // Calculate overall totals for bar chart.
    const totalEmiPayment = EMI * totalMonths;
    const totalCost = downPayment + totalEmiPayment;
    const totalInterest = totalEmiPayment - principal;

    // Prepare our chart data structure.
    setLiabilityData({
      labels,
      cumulativeLiability,
      realCumulativeLiability,
      totalCost,
      totalInterest,
      downPayment,
      principal,
      EMI,
      isEmiValid,
    });
  };

  // Prepare Line Chart data – showing liability growth over time.
  const lineChartData = {
    labels: liabilityData?.labels,
    datasets: [
      {
        label: "Nominal Liability",
        data: liabilityData?.cumulativeLiability,
        borderColor: "rgb(255, 99, 132)",
        tension: 0.2,
      },
      {
        label: "Real Liability (Inflation Adjusted)",
        data: liabilityData?.realCumulativeLiability,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.2,
      },
    ],
  };

  // Prepare Bar Chart data – breakdown of costs.
  const barChartData = {
    labels: ["Down Payment", "Loan Amount", "Total Interest"],
    datasets: [
      {
        label: "Amount (₹)",
        data: [
          liabilityData?.downPayment,
          liabilityData?.principal,
          liabilityData?.totalInterest,
        ],
        backgroundColor: [
          "rgba(75, 192, 192, 0.6)",
          "rgba(255, 205, 86, 0.6)",
          "rgba(255, 99, 132, 0.6)",
        ],
      },
    ],
  };

  return (
    <div className="space-y-8 p-4">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          {warikooData[params.id]?.name}
        </h1>
        <p className="text-md font-semibold text-gray-600">
          {warikooData[params.id]?.description}
        </p>
      </div>

      {/* Dynamic Input Fields */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {warikooData[params.id]?.inputs.map((inputData) => (
          <div key={inputData.id} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {inputData.label}
            </label>
            <input
              type={inputData.type}
              min={inputData.min}
              max={inputData.max}
              step={inputData.step}
              value={baseInfo[inputData.id] || 0}
              required={inputData.required}
              onChange={(e) => {
                const value = Number(e.target.value);
                setBaseInfo((prev) => ({
                  ...prev,
                  [inputData.id]: value,
                }));
                validateInput(inputData.id, value);
              }}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            {errors[inputData.id] && (
              <p className="text-sm text-red-600">{errors[inputData.id]}</p>
            )}
          </div>
        ))}
      </div>

      {/* Inflation Adjuster */}
      <InflationAdjuster
        enabled={isInflationEnabled}
        setEnabled={setIsInflationEnabled}
        inflation={inflation}
        onInflationChange={(value: number) => setInflation(value)}
      />

      {/* Charts Display */}
      {liabilityData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">
              Liability Growth Over Time
            </h2>
            <Line
              data={lineChartData}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: "top" },
                  title: { display: true, text: "Cumulative Liability" },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: (value) =>
                        `${formatCurrency(Number(value), currencyConfig)}`,
                    },
                  },
                },
              }}
            />
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Cost Breakdown</h2>
            <Bar
              data={barChartData}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: "top" },
                  title: { display: true, text: "Liability Components" },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: (value) =>
                        `${formatCurrency(Number(value), currencyConfig)}`,
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      )}

      {/* Summary */}
      {liabilityData && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold text-gray-700">Total Cost</h3>
            <p className="text-2xl font-bold text-blue-600">
              {formatCurrency(liabilityData.totalCost, currencyConfig)}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold text-gray-700">Monthly EMI</h3>
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(liabilityData.EMI, currencyConfig)}
            </p>
            {!liabilityData.isEmiValid && (
              <p className="text-sm text-red-600 mt-1">
                EMI exceeds 10% of your monthly income!
              </p>
            )}
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold text-gray-700">
              Total Interest
            </h3>
            <p className="text-2xl font-bold text-purple-600">
              {formatCurrency(liabilityData.totalInterest, currencyConfig)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
