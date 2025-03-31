export interface TabsProps {
  tabList: TabList[];
  onChange?: (tabId: string) => void;
  selected?: string;
  variant?: "outlined" | "filled";
}

export interface TabList {
  id: string;
  value: React.ReactNode | string;
  redirection?: string;
}
