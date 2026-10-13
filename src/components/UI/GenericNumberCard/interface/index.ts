import type { ElementType } from "react";

export interface GenericNumberCardProps {
  Ammount: number;
  tone: "primary" | "success" | "warning" | "danger";
  title: string;
  IconName?: ElementType;
  performance: "Increase" | "Decrease";
  performanceAmmount: number;
  currencySymbol?: "$" | "£" | "₹" | "Rs.";
  isLoading: boolean;
}