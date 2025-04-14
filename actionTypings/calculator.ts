export type InputType = "number" | "text" | "select" | "slider";

export interface CalculatorInput {
  name: string;
  label: string;
  type: InputType;
  default: number | string;
  min?: number;
  max?: number;
  step?: number;
  required?: boolean;
  errorMessage?: string;
  options?: { label: string; value: string }[]; // for select
}

export interface CalculatorOutputs {
  showChart: boolean;
  showBarChart: boolean;
  showLineChart: boolean;
  showBreakdown: boolean;
}

export interface CalculatorChartConfig {
  line?: {
    labels: string;
    datasets: string[];
  };
  bar?: {
    labels: string[];
    dataset: string[];
  };
}

export interface CalculatorConfig {
  name: string;
  calculationType: string;
  inputs: CalculatorInput[];
  outputs: CalculatorOutputs;
  charts?: CalculatorChartConfig;
}
