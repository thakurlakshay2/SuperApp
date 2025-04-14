"use client";

import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { Bar } from "react-chartjs-2";
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
import { sipData } from "../dummyData";
import { evaluate } from "mathjs";

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

import InflationAdjuster from "@/components/InflationAdjuster.tsx";
import StepUpInvestment, {
  StepUpYearlyConfig,
} from "@/components/StepUpInvestment.tsx";

// Create your config
const currencyConfig = {
  currency: "₹",
  locale: "en-IN",
  compact: true,
  decimals: 2,
};
export default function SIPCalculator() {
  const [baseInfo, setBaseInfo] = useState<Record<string, number>>();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [investment, setInvestment] = useState(50000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(10);
  const [data, setData] = useState<any>(null);
  const [inflation, setInflation] = useState<number>(0);
  const [isStepupEnabled, setIsStepupEnabled] = useState<boolean>(false);
  const [isInflationEnabled, setIsInflationEnabld] = useState<boolean>(false);
  const [stepUpConfig, setStepUpConfig] = useState<StepUpYearlyConfig[]>([]);
  //poluplating BaseInfo Data
  function hasNonEmptyStringValue(obj) {
    for (const key in obj) {
      if (Object.hasOwnProperty.call(obj, key)) {
        if (typeof obj[key] === "string" && obj[key] !== "") {
          return true;
        }
      }
    }
    return false;
  }
  useEffect(() => {
    const baseInfo = {};
    sipData.inputs.forEach((data) => {
      baseInfo[data.id] = data.default;
    });

    setBaseInfo(baseInfo);
  }, []);
  useEffect(() => {
    if (baseInfo && !hasNonEmptyStringValue(errors)) calculateReturns();
  }, [baseInfo, stepUpConfig, inflation, isInflationEnabled, isStepupEnabled]);

  const validateInput = (id: string, value: number) => {
    const inputMeta = sipData.inputs.find((input) => input.id === id);
    if (!inputMeta) return;

    let error = "";

    if (
      inputMeta.required &&
      (value === null ||
        value === undefined ||
        value === 0 ||
        value < inputMeta.min ||
        value > inputMeta.max)
    ) {
      error = inputMeta.errorMessage;
    }

    setErrors((prev) => ({ ...prev, [id]: error }));
  };

  const calculateReturns = () => {
    if (!baseInfo || !sipData?.formula) return;

    const periodField = sipData.inputs.find(
      (input) =>
        input.id.toLowerCase().includes("period") ||
        input.label.toLowerCase().includes("period") ||
        input.label.toLowerCase().includes("years")
    );
    const investmentField = sipData.inputs.find(
      (input) =>
        input.id.toLowerCase().includes("investment") ||
        input.label.toLowerCase().includes("investment")
    );
    const rateField = sipData.inputs.find(
      (input) =>
        input.id.toLowerCase().includes("rate") ||
        input.label.toLowerCase().includes("return")
    );

    if (
      !periodField ||
      !investmentField ||
      !rateField ||
      !baseInfo[periodField.id] ||
      !baseInfo[rateField.id]
    ) {
      console.error("Required fields not found in calculator data or baseInfo");
      return;
    }

    const yearsFromInput = baseInfo[periodField.id];
    setYears(yearsFromInput);
    const initialInvestmentFromInput = baseInfo[investmentField.id];
    setInvestment(initialInvestmentFromInput);
    const annualRate = baseInfo[rateField.id];

    const currentInflation = isInflationEnabled ? inflation : 0;

    const monthlyRate = annualRate / 12 / 100;
    const monthlyInflationRate = currentInflation / 12 / 100;
    const totalMonths = yearsFromInput * 12;

    const labels = Array.from({ length: yearsFromInput + 1 }, (_, i) => i);
    const investmentData: number[] = [0];
    const returnsData: number[] = [0];
    const realReturnsData: number[] = [0];

    let totalInvestment = 0;
    let accumulatedValue = 0;
    let currentMonthlyInvestment = initialInvestmentFromInput;
    console.log(stepUpConfig);
    for (let year = 1; year <= yearsFromInput; year++) {
      // currentMonthlyInvestment = stepUpConfig[year].investment;
    }
    console.log(stepUpConfig);
    // for (let month = 1; month <= totalMonths; month++) {
    //   const year = Math.ceil(month / 12);

    //   // Apply step-up at the beginning of each year
    //   const applicableStepUp = stepUpConfig.find(
    //     (config) => year >= config.fromYear && year <= config.toYear
    //   );

    //   if (month % 12 === 1) {
    //     if (applicableStepUp) {
    //       // For the first month of the year, apply the step-up to the initial monthly investment
    //       currentMonthlyInvestment =
    //         initialInvestmentFromInput *
    //         Math.pow(
    //           1 + applicableStepUp.increasePercent / 100,
    //           year - applicableStepUp.fromYear
    //         );
    //     } else if (
    //       year > 1 &&
    //       !stepUpConfig.some(
    //         (config) => year >= config.fromYear && year <= config.toYear
    //       )
    //     ) {
    //       // If no specific step-up for this year, maintain the last stepped-up amount
    //       const lastConfig = stepUpConfig
    //         .filter((config) => config.toYear < year)
    //         .sort((a, b) => b.toYear - a.toYear)[0];

    //       if (lastConfig) {
    //         let previousInvestment = initialInvestmentFromInput;
    //         for (let y = 1; y < year; y++) {
    //           const prevStep = stepUpConfig.find(
    //             (c) => y >= c.fromYear && y <= c.toYear
    //           );
    //           if (prevStep) {
    //             previousInvestment *= 1 + prevStep.increasePercent / 100;
    //           }
    //         }
    //         currentMonthlyInvestment = previousInvestment;
    //       } else {
    //         currentMonthlyInvestment = initialInvestmentFromInput;
    //       }
    //     } else if (year === 1) {
    //       currentMonthlyInvestment = initialInvestmentFromInput; // No step-up in the first year unless configured from year 1
    //     }
    //   }

    //   totalInvestment += currentMonthlyInvestment;
    //   accumulatedValue =
    //     (accumulatedValue + currentMonthlyInvestment) * (1 + monthlyRate);

    //   // Adjust for inflation at the end of each year for yearly data point
    //   if (month % 12 === 0) {
    //     const inflationFactor = Math.pow(1 + monthlyInflationRate, month);
    //     investmentData.push(totalInvestment);
    //     returnsData.push(accumulatedValue);
    //     realReturnsData.push(accumulatedValue / inflationFactor);
    //   }
    // }

    investmentData.unshift(0);
    returnsData.unshift(0);
    realReturnsData.unshift(0);

    setData({
      labels,
      investmentData,
      returnsData,
      realReturnsData,
      totalInvestment,
      totalReturns: accumulatedValue,
    });
  };

  const lineChartData = {
    labels: data?.labels,
    datasets: [
      {
        label: "Investment",
        data: data?.investmentData,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
      {
        label: "Returns",
        data: data?.returnsData,
        borderColor: "rgb(255, 99, 132)",
        tension: 0.1,
      },
    ],
  };

  const barChartData = {
    labels: ["Total Investment", "Total Returns", "Total Value"],
    datasets: [
      {
        label: "Amount (₹)",
        data: [
          data?.totalInvestment,
          data?.totalReturns - data?.totalInvestment,
          data?.totalReturns,
        ],
        backgroundColor: [
          "rgba(75, 192, 192, 0.6)",
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
        ],
      },
    ],
  };

  return (
    <div className="space-y-8 ">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">{sipData.name}</h1>
        <p className="text-md font-semibold text-gray-600">
          {sipData.description}
        </p>
      </div>
      <div className="transition-all duration-300 grid grid-cols-1 md:grid-cols-3 gap-6">
        {sipData.inputs.map((inputData) => {
          return (
            <div key={inputData.id} className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {inputData.label}
              </label>
              <input
                type={inputData.type}
                // defaultValue={inputData.default}
                min={inputData.min}
                max={inputData.max}
                step={inputData.step}
                value={(baseInfo?.[inputData.id] || 0) as number}
                required={inputData.required}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  const id = inputData.id;
                  setBaseInfo((prevSnapShot) => {
                    return {
                      ...prevSnapShot,
                      [inputData.id]: Number(e.target.value),
                    };
                  });
                  validateInput(id, value);

                  // setInvestment(Number(e.target.value));
                }}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <p
                className={`text-sm mt-1 transition-all duration-300 origin-top ${
                  errors[inputData.id]
                    ? "text-red-600 opacity-1  visible"
                    : "opacity-0 invisible"
                }`}
                style={{ willChange: "opacity, height" }}
              >
                {errors[inputData.id] || ""}
              </p>
            </div>
          );
        })}
      </div>
      <InflationAdjuster
        enabled={isInflationEnabled}
        setEnabled={setIsInflationEnabld}
        inflation={inflation}
        onInflationChange={function (value: number): void {
          setInflation(value);
        }}
      />
      <StepUpInvestment
        enabled={isStepupEnabled}
        setEnabled={setIsStepupEnabled}
        years={years}
        baseInvestment={investment}
        onStepUpConfigChange={function (
          stepUpConfig: StepUpYearlyConfig[]
        ): void {
          setStepUpConfig(stepUpConfig);
        }}
      />
      {data && (
        <div className="transition-all duration-300 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Investment Growth</h2>
            <Line
              data={lineChartData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: "top",
                  },
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
            <h2 className="text-xl font-semibold mb-4">Investment Summary</h2>
            <Bar
              data={barChartData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: "top",
                  },
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

      {data && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold text-gray-700">
              Total Investment
            </h3>
            <p className="text-2xl font-bold text-blue-600">
              ₹{data.totalInvestment.toLocaleString()}
              <span className="flex mt-2 text-xl font-regular text-blue-600">
                (~{formatCurrency(data.totalInvestment, currencyConfig)})
              </span>
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold text-gray-700">
              Total Returns
            </h3>
            <p className="text-2xl font-bold text-green-600">
              ₹{(data.totalReturns - data.totalInvestment).toLocaleString()}
              <span className=" flex mt-2 text-xl font-regular text-green-600">
                (~
                {formatCurrency(
                  data.totalReturns - data.totalInvestment,
                  currencyConfig
                )}
                )
              </span>
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold text-gray-700">Total Value</h3>
            <p className="text-2xl font-bold text-purple-600">
              ₹{data.totalReturns.toLocaleString()}
              <span className=" flex mt-2 text-xl font-regular text-purple-600">
                (~{formatCurrency(data.totalReturns, currencyConfig)})
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
