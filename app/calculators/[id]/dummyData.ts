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

export const warikooData = {
  vehicle: {
    calculatorId: "warikoo/Vehicle",
    name: "Car/Bike Affordability Calculator",
    description:
      "Follow the 20/4/10 rule to check if you can afford your next car or bike. A 20% down payment, 4-year max loan, and EMI ≤10% of monthly income ensures financial safety.",
    inputs: [
      {
        id: "vehicleCost",
        label: "On-Road Price of Vehicle (₹)",
        type: "number",
        default: 200000,
        min: 10000,
        max: 10000000,
        step: 1000,
        required: true,
        errorMessage: "Price must be between ₹10,000 and ₹1 crore",
      },
      {
        id: "monthlyIncome",
        label: "Monthly Salary After Tax (₹)",
        type: "number",
        default: 50000,
        min: 5000,
        max: 1000000,
        step: 1000,
        required: true,
        errorMessage: "Monthly income must be between ₹5,000 and ₹10,00,000",
      },
      {
        id: "downPayment",
        label: "Planned Down Payment (₹)",
        type: "number",
        default: 40000,
        min: 0,
        max: 10000000,
        step: 1000,
        required: false,
      },
      {
        id: "loanTenure",
        label: "Loan Term (Years)",
        type: "number",
        default: 4,
        min: 1,
        max: 7,
        step: 1,
        required: false,
      },
      {
        id: "interestRate",
        label: "Loan Interest Rate (% p.a.)",
        type: "number",
        default: 9,
        min: 5,
        max: 15,
        step: 0.1,
        required: false,
      },
    ],
    formula: `
      let principal = vehicleCost - (downPayment || vehicleCost * 0.2);
      let r = (interestRate || 9) / 12 / 100;
      let n = (loanTenure || 4) * 12;
      let emi = principal * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
      let maxEmi = monthlyIncome * 0.1;
      let requiredDown = vehicleCost * 0.2;
      let isLoanTermValid = (loanTenure || 4) <= 4;
      let isDownPaymentValid = (downPayment || vehicleCost * 0.2) >= requiredDown;
      let isEmiValid = emi <= maxEmi;
    `,
    outputs: {
      showBreakdown: true,
      showBarChart: true,
    },
    charts: {
      bar: {
        labels: ["Down Payment", "Loan Amount", "Total Interest", "Total EMI"],
        dataset: ["Amount (₹)"],
      },
    },
  },
};
