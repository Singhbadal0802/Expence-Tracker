export interface GenericNumberCardProps {
    Ammount : number;
    tone : "primary" | "success" | "warning" | "danger";
    title : string;
    iconName? : string;
    performance : "Increase" | "decrease";
    performanceAmmount : number;
    currencySymbol? : "$" | "£" | "₹" | "Rs.";
}