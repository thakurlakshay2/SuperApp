// components/StepUpInvestment.tsx
"use client";

import {
  useState,
  useEffect,
  SetStateAction,
  Dispatch,
  useCallback,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import formatCurrency from "@/utils/formatCurrency";

interface StepUpInvestmentProps {
  enabled: boolean;
  setEnabled: Dispatch<SetStateAction<boolean>>;
  years: number;
  baseInvestment: number | undefined;
  onStepUpConfigChange: (stepUpConfig: StepUpYearlyConfig[]) => void;
}

export interface StepUpConfig {
  fromYear: number;
  toYear: number;
  increasePercent: number;
  investmentAmount: number;
  totalInvestmentPerYear: number;
}

export interface StepUpYearlyConfig {
  year: number;
  stepUpPercent: number;
  investment: number;
}

const StepUpInvestment: React.FC<StepUpInvestmentProps> = ({
  enabled,
  setEnabled,
  years,
  baseInvestment,
  onStepUpConfigChange,
}) => {
  const [toggle, setToggle] = useState<boolean>(false);
  const [stepUpConfigs, setStepUpConfigs] = useState<StepUpConfig[]>([]);
  const [yearlyData, setYearlyData] = useState<StepUpYearlyConfig[]>([
    { year: 0, stepUpPercent: 0, investment: baseInvestment || 0 },
  ]);
  const [newStepUp, setNewStepUp] = useState<Omit<StepUpConfig, "toYear">>({
    fromYear: 1,
    increasePercent: 0,
    investmentAmount: baseInvestment || 0,
    totalInvestmentPerYear: (baseInvestment || 0) * years,
  });
  // Use this to prevent infinite loops
  const [prevYearsRef, setPrevYearsRef] = useState<number>(years);
  const [configUpdated, setConfigUpdated] = useState<boolean>(false);

  // Calculate investment at a specific year
  const calculateInvestmentAtYear = useCallback(
    (targetYear: number): number => {
      if (targetYear <= 0 || !baseInvestment) return baseInvestment || 0;

      let currentInvestment = baseInvestment;
      const sortedConfigs = [...stepUpConfigs].sort(
        (a, b) => a.fromYear - b.fromYear
      );

      for (let y = 1; y <= targetYear; y++) {
        const matchingConfig = sortedConfigs.find(
          (config) => y >= config.fromYear && y <= config.toYear
        );

        if (matchingConfig) {
          currentInvestment *= 1 + matchingConfig.increasePercent / 100;
        }
      }

      return currentInvestment;
    },
    [baseInvestment, stepUpConfigs]
  );

  // Generate yearly data - only when needed
  const generateYearlyData = useCallback(() => {
    if (!baseInvestment) {
      return [{ year: 0, stepUpPercent: 0, investment: baseInvestment || 0 }];
    }

    const data: StepUpYearlyConfig[] = [
      { year: 0, stepUpPercent: 0, investment: baseInvestment },
    ];

    for (let year = 1; year < years; year++) {
      let appliedStepUp = 0;
      const matchingConfig = stepUpConfigs.find(
        (config) => year >= config.fromYear && year <= config.toYear
      );

      if (matchingConfig) {
        appliedStepUp = matchingConfig.increasePercent;
      }

      // Calculate investment amount for this year
      const investment = calculateInvestmentAtYear(year);

      data.push({
        year,
        stepUpPercent: appliedStepUp,
        investment,
      });
    }

    return data;
  }, [baseInvestment, calculateInvestmentAtYear, stepUpConfigs, years]);

  // Extend step-up configs when years increase
  const extendStepUpConfigs = useCallback(() => {
    if (years <= prevYearsRef || stepUpConfigs.length === 0) return;

    // Find the last config by toYear
    const sortedConfigs = [...stepUpConfigs].sort(
      (a, b) => b.toYear - a.toYear
    );
    const lastConfig = sortedConfigs[0];

    if (!lastConfig || lastConfig.toYear >= years) return;

    // Extend the last config to the new years value
    setStepUpConfigs((prev) => {
      return prev.map((config) => {
        if (config.fromYear === lastConfig.fromYear) {
          // Recalculate the total with the extended years
          const priorAmount = calculateInvestmentAtYear(config.fromYear - 1);
          const r = 1 + config.increasePercent / 100;
          const n = years - config.fromYear + 1;

          const totalAmount =
            r !== 1
              ? priorAmount * ((Math.pow(r, n) - 1) / (r - 1))
              : priorAmount * n;

          return {
            ...config,
            toYear: years,
            totalInvestmentPerYear: totalAmount,
          };
        }
        return config;
      });
    });
  }, [years, prevYearsRef, stepUpConfigs, calculateInvestmentAtYear]);

  // Handle base investment changes
  useEffect(() => {
    if (baseInvestment !== undefined) {
      const updatedData = generateYearlyData();
      setYearlyData(updatedData);
      setConfigUpdated(true);
    }
  }, [baseInvestment, generateYearlyData]);

  // Handle years changes
  useEffect(() => {
    if (years !== prevYearsRef) {
      // Extend configs if years increased
      if (years > prevYearsRef) {
        extendStepUpConfigs();
      }

      // Always update yearly data when years change
      const updatedData = generateYearlyData();
      setYearlyData(updatedData);
      setConfigUpdated(true);

      // Store new years value
      setPrevYearsRef(years);
    }
  }, [years, prevYearsRef, extendStepUpConfigs, generateYearlyData]);

  // Update when stepUpConfigs change
  useEffect(() => {
    const updatedData = generateYearlyData();
    setYearlyData(updatedData);
    setConfigUpdated(true);
  }, [stepUpConfigs, generateYearlyData]);

  // Notify parent component of changes when enabled - with protection against infinite loops
  useEffect(() => {
    if (enabled && configUpdated) {
      onStepUpConfigChange(yearlyData);
      setConfigUpdated(false);
    }
  }, [enabled, yearlyData, onStepUpConfigChange, configUpdated]);

  // Calculate total investment for a step-up period
  const calculateTotalInvestment = (
    fromYear: number,
    toYear: number,
    increasePercent: number
  ): number => {
    const priorAmount = calculateInvestmentAtYear(fromYear - 1);
    const r = 1 + increasePercent / 100;
    const n = toYear - fromYear + 1;

    return r !== 1
      ? priorAmount * ((Math.pow(r, n) - 1) / (r - 1))
      : priorAmount * n;
  };

  const addStepUp = () => {
    if (!baseInvestment) {
      alert("Base investment is required to configure step-up.");
      return;
    }

    if (
      newStepUp.fromYear >= 1 &&
      newStepUp.fromYear <= years &&
      newStepUp.increasePercent !== 0
    ) {
      const totalAmount = calculateTotalInvestment(
        newStepUp.fromYear,
        years,
        newStepUp.increasePercent
      );

      const priorAmount = calculateInvestmentAtYear(newStepUp.fromYear - 1);

      const newConfig: StepUpConfig = {
        fromYear: newStepUp.fromYear,
        toYear: years,
        increasePercent: newStepUp.increasePercent,
        investmentAmount: priorAmount * (1 + newStepUp.increasePercent / 100),
        totalInvestmentPerYear: totalAmount,
      };

      // Find if we have an existing config for this fromYear
      const existingIndex = stepUpConfigs.findIndex(
        (config) => config.fromYear === newStepUp.fromYear
      );

      let updatedConfigs = [...stepUpConfigs];
      if (existingIndex !== -1) {
        updatedConfigs[existingIndex] = newConfig;
      } else {
        updatedConfigs.push(newConfig);
      }

      // Adjust toYear of preceding configs
      updatedConfigs = updatedConfigs.map((config) => {
        if (
          config.fromYear < newConfig.fromYear &&
          config.toYear >= newConfig.fromYear
        ) {
          const adjustedToYear = newConfig.fromYear - 1;
          const adjustedTotal = calculateTotalInvestment(
            config.fromYear,
            adjustedToYear,
            config.increasePercent
          );

          return {
            ...config,
            toYear: adjustedToYear,
            totalInvestmentPerYear: adjustedTotal,
          };
        }
        return config;
      });

      // Sort by fromYear
      updatedConfigs.sort((a, b) => a.fromYear - b.fromYear);
      setStepUpConfigs(updatedConfigs);

      // Reset the new step-up form
      setNewStepUp({
        fromYear: Math.min(newStepUp.fromYear + 1, years),
        increasePercent: 0,
        investmentAmount: baseInvestment,
        totalInvestmentPerYear: baseInvestment * years,
      });
    } else {
      alert(
        "Please enter a valid start year and a non-zero increase percentage."
      );
    }
  };

  const removeStepUp = (index: number) => {
    const updatedConfigs = stepUpConfigs.filter((_, i) => i !== index);
    setStepUpConfigs(updatedConfigs);
  };

  const toggleAccordion = () => {
    setToggle((prev) => !prev);
  };

  return (
    <div className="bg-teal-100 shadow-lg rounded-xl p-4">
      <div
        className="flex items-center justify-between mb-4 cursor-pointer"
        onClick={toggleAccordion}
      >
        <div className="flex items-center space-x-3">
          <input
            onClick={(e) => {
              e.stopPropagation();
              setEnabled((prev) => !prev);
              setConfigUpdated(true); // Trigger update when toggling
            }}
            type="checkbox"
            id="toggleStepUp"
            checked={enabled}
            className="h-5 w-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500 cursor-pointer"
          />
          <label
            onClick={(e) => {
              e.stopPropagation();
            }}
            htmlFor="toggleStepUp"
            className="text-md font-semibold text-gray-800 cursor-pointer"
          >
            Step-Up Investment
          </label>
        </div>
        <motion.svg
          animate={{ rotate: toggle ? 90 : 0 }}
          transition={{ duration: 0.2 }}
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-gray-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </motion.svg>
      </div>

      <AnimatePresence>
        {toggle && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 overflow-hidden"
          >
            <div className="grid grid-cols-3 gap-4 mb-2">
              <label
                htmlFor="fromYear"
                className="block text-sm font-medium text-gray-700"
              >
                Start Year
              </label>
              <label
                htmlFor="increasePercent"
                className="block text-sm font-medium text-gray-700"
              >
                Increase (%)
              </label>
              <div></div>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-2 items-center">
              <input
                type="number"
                id="fromYear"
                className="w-full px-3 py-2 border rounded-md focus:ring-teal-500 focus:border-teal-500 text-sm"
                value={newStepUp.fromYear}
                onChange={(e) =>
                  setNewStepUp({
                    ...newStepUp,
                    fromYear: Number(e.target.value),
                  })
                }
                min={1}
                max={years}
              />
              <input
                type="number"
                id="increasePercent"
                className="w-full px-3 py-2 border rounded-md focus:ring-teal-500 focus:border-teal-500 text-sm"
                value={newStepUp.increasePercent}
                onChange={(e) =>
                  setNewStepUp({
                    ...newStepUp,
                    increasePercent: Number(e.target.value),
                  })
                }
                step={0.1}
              />
              <button
                type="button"
                className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline text-sm"
                onClick={addStepUp}
              >
                Add
              </button>
            </div>

            {stepUpConfigs.length > 0 && (
              <div className="mt-6">
                <h4 className="text-md font-semibold text-gray-700 mb-2">
                  Step-Up Configurations:
                </h4>
                <div className="overflow-x-auto mb-4">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Years
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Increase (%)
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Total Investment Amount
                        </th>
                        <th scope="col" className="relative px-6 py-3">
                          <span className="sr-only">Remove</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {stepUpConfigs
                        .sort((a, b) => a.fromYear - b.fromYear)
                        .map((config, index) => (
                          <motion.tr
                            key={index}
                            layout
                            className="hover:bg-gray-100"
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                              {config.fromYear} - {config.toYear}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                              {config.increasePercent}%
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                              {formatCurrency(
                                config.totalInvestmentPerYear * 12,
                                {
                                  currency: "₹",
                                  locale: "en-IN",
                                  compact: false,
                                  decimals: 2,
                                }
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                onClick={() => removeStepUp(index)}
                                className="text-red-500 hover:text-red-700 focus:outline-none"
                              >
                                Remove
                              </button>
                            </td>
                          </motion.tr>
                        ))}
                    </tbody>
                  </table>
                </div>

                {yearlyData.length > 0 && (
                  <div>
                    <h4 className="text-md font-semibold text-gray-700 mb-2">
                      Yearly Breakdown:
                    </h4>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Year
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Step-Up (%)
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Investment Amount /Month
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {yearlyData.map((data) => (
                            <tr key={data.year} className="hover:bg-gray-100">
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                                {data.year}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                                {data.stepUpPercent}%
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                                {formatCurrency(data.investment, {
                                  currency: "₹",
                                  locale: "en-IN",
                                  compact: false,
                                  decimals: 2,
                                })}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StepUpInvestment;
