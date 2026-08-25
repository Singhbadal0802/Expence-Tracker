import { ReactElement, ReactNode } from "react";

export interface GenericNumberCardProps {
    Ammount : number;
    tone : "primary" | "success" | "warning" | "danger";
    title : string;
    IconName? : React.ElementType;
    performance : "Increase" | "decrease";
    performanceAmmount : number;
    currencySymbol? : "$" | "£" | "₹" | "Rs.";
}