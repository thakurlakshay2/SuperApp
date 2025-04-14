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

export default function Calculator() {
  const [baseInfo, setBaseInfo] = useState<Record<string, number>>();
  const [investment, setInvestment] = useState(50000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(10);
  const [data, setData] = useState<any>(null);

  //poluplating BaseInfo Data
  useEffect(() => {
    const baseInfo = {};
    sipData.inputs.forEach((data) => {
      baseInfo[data.id] = data.default;
    });

    setBaseInfo(baseInfo);
  }, []);
  useEffect(() => {
    console.log(" i m here");
    if (baseInfo) calculateReturns();
  }, [baseInfo]);

  const calculateReturns = () => {
    if (!baseInfo || !sipData?.formula) return;

    // Use the formula from the backend to calculate the final amount
    const result = evaluate(sipData.formula, baseInfo);
    console.log("Total maturity amount:", result);

    // Extract the required properties from baseInfo dynamically
    // Find the period field (we need to know how many years to show)
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

    if (!periodField || !investmentField || !rateField) {
      console.error("Required fields not found in calculator data");
      return;
    }

    const years = baseInfo[periodField.id];
    const investment = baseInfo[investmentField.id];
    const annualRate = baseInfo[rateField.id];
    const monthlyRate = annualRate / 12 / 100;

    const labels = Array.from({ length: years + 1 }, (_, i) => i);

    // Calculate investment and returns for each year
    const investmentData = labels.map((year) => investment * 12 * year);

    // Calculate returns using the same formula logic from the backend
    const returnsData = labels.map((year) => {
      if (year === 0) return 0;

      // Create a temporary object with properties for the current year
      const tempInfo = { ...baseInfo };
      tempInfo[periodField.id] = year;

      // Calculate using the backend formula
      return evaluate(sipData.formula, tempInfo).entries[0];
    });
    console.log({
      labels,
      investmentData,
      returnsData,
      totalInvestment: investment * 12 * years,
      totalReturns: returnsData[years],
    });

    setData({
      labels,
      investmentData,
      returnsData,
      totalInvestment: investment * 12 * years,
      totalReturns: returnsData[years],
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
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">SIP Calculator</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                  setBaseInfo((prevSnapShot) => {
                    return {
                      ...prevSnapShot,
                      [inputData.id]: Number(e.target.value),
                    };
                  });
                  setInvestment(Number(e.target.value));
                }}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <p>{inputData.errorMessage}</p>
            </div>
          );
        })}
      </div>

      {data && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                      callback: (value) => `₹${value}`,
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
                      callback: (value) => `₹${value}`,
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
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold text-gray-700">
              Total Returns
            </h3>
            <p className="text-2xl font-bold text-green-600">
              ₹{(data.totalReturns - data.totalInvestment).toLocaleString()}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold text-gray-700">Total Value</h3>
            <p className="text-2xl font-bold text-purple-600">
              ₹{data.totalReturns.toLocaleString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
