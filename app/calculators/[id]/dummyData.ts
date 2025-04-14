export const sipData = {
  calculatorId: "sip",
  name: "SIP Calculator",
  description:
    "Calculate the future value of your Systematic Investment Plan (SIP).",
  inputs: [
    {
      id: "monthlyInvestment",
      label: "Monthly Investment (₹)",
      type: "number",
      default: 5000,
      min: 100,
      max: 100000,
      step: 100,
      required: true,
      errorMessage: "Monthly investment must be between ₹100 and ₹1,00,000",
    },
    {
      id: "annualReturnRate",
      label: "Expected Return Rate (% p.a.)",
      type: "number",
      default: 12,
      min: 1,
      max: 30,
      step: 0.1,
      required: true,
      errorMessage: "Return rate must be between 1% and 30%",
    },
    {
      id: "investmentPeriod",
      label: "Investment Period (Years)",
      type: "number",
      default: 10,
      min: 1,
      max: 50,
      step: 1,
      required: true,
      errorMessage: "Investment period must be between 1 and 50 years",
    },
  ],

  formula:
    "r = annualReturnRate/12/100; n = investmentPeriod*12; monthlyInvestment * ((1 + r)^n - 1) * (1 + r) / r",

  outputs: {
    showChart: true,
    showBarChart: true,
    showLineChart: true,
    showBreakdown: true,
  },
  charts: {
    line: {
      labels: "Years",
      datasets: ["Investment", "Returns"],
    },
    bar: {
      labels: ["Total Investment", "Total Returns", "Total Value"],
      dataset: ["Amount (₹)"],
    },
  },
};
