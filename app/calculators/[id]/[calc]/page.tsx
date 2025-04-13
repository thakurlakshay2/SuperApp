"use client";

import { useState, useEffect } from "react";
import { cn } from "@/components/Button";

function calculateSIP(
  monthlyInvestment: number,
  annualRate: number,
  durationYears: number
) {
  const r = annualRate / 12 / 100;
  const n = durationYears * 12;
  const fv = (monthlyInvestment * ((Math.pow(1 + r, n) - 1) * (1 + r))) / r;
  return fv;
}

export default function SIPCalculator({
  params,
}: {
  params: { calc: string };
}) {
  const decodedId = decodeURIComponent(params.calc).replace(/-/g, " ");

  const [amount, setAmount] = useState(5000);
  const [rate, setRate] = useState(12);
  const [duration, setDuration] = useState(10);
  const [futureValue, setFutureValue] = useState(0);

  useEffect(() => {
    const fv = calculateSIP(amount, rate, duration);
    setFutureValue(fv);
  }, [amount, rate, duration]);

  return (
    <div
      key={"testing" + decodedId}
      className={cn("text-gray-900", "flex flex-col gap-8 w-1/2 m-auto")}
    >
      <h1 className="text-3xl font-semibold text-center">SIP Calculator</h1>

      {/* Amount Input + Slider */}
      <div className="bg-white/30 p-6 rounded-xl backdrop-blur-md shadow-lg">
        <label className="block text-sm font-medium mb-2">
          Monthly Investment (₹)
        </label>
        <input
          type="number"
          min={500}
          step={100}
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-full mb-4 p-2 rounded-lg bg-white/50 backdrop-blur placeholder:text-gray-500"
        />
        <input
          type="range"
          min={500}
          max={100000}
          step={100}
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Interest Rate */}
      <div className="bg-white/30 p-6 rounded-xl backdrop-blur-md shadow-lg">
        <label className="block text-sm font-medium mb-2">
          Expected Annual Return (%)
        </label>
        <input
          type="range"
          min={1}
          max={20}
          step={0.5}
          value={rate}
          onChange={(e) => setRate(Number(e.target.value))}
          className="w-full"
        />
        <div className="mt-2 text-right text-sm text-gray-700">{rate}%</div>
      </div>

      {/* Duration */}
      <div className="bg-white/30 p-6 rounded-xl backdrop-blur-md shadow-lg">
        <label className="block text-sm font-medium mb-2">
          Investment Duration (Years)
        </label>
        <input
          type="range"
          min={1}
          max={30}
          step={1}
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          className="w-full"
        />
        <div className="mt-2 text-right text-sm text-gray-700">
          {duration} years
        </div>
      </div>

      {/* Result */}
      <div className="text-center bg-white/40 backdrop-blur-md p-6 rounded-2xl shadow-xl">
        <h2 className="text-lg font-medium">Estimated Future Value</h2>
        <p className="text-3xl font-bold mt-2 text-indigo-700">
          ₹{futureValue.toLocaleString()}
        </p>
      </div>
    </div>
  );
}
