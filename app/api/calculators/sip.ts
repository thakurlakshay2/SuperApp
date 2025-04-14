import { CalculatorConfig } from "@/actionTypings/calculator";
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const sipConfig: CalculatorConfig = {
    name: "SIP Calculator",
    calculationType: "sip",
    inputs: [
      {
        name: "investment",
        label: "Monthly Investment (₹)",
        type: "number",
        default: 5000,
        min: 100,
        max: 1000000,
        step: 100,
        required: true,
        errorMessage: "Investment must be between ₹100 and ₹10,00,000",
      },
      {
        name: "rate",
        label: "Expected Return Rate (% p.a.)",
        type: "number",
        default: 12,
        min: 1,
        max: 50,
        step: 0.1,
      },
      {
        name: "years",
        label: "Time Period (Years)",
        type: "number",
        default: 10,
        min: 1,
        max: 50,
        step: 1,
      },
    ],
    outputs: {
      showChart: true,
      showBarChart: true,
      showLineChart: true,
      showBreakdown: true,
    },
  };

  res.status(200).json(sipConfig);
}
