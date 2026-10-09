import type { MouseEvent as ReactMouseEvent } from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant: "brand-primary" | "brand-secondary";
  buttonLabel: string;
  onClick?: (e: ReactMouseEvent<HTMLButtonElement>) => void;
  tone: "primary" | "success" | "warning" | "danger";
  customClass?: string;
  isLoading?: boolean;
  disabled?: boolean;
  tabIndex?: number;
  props? : React.ButtonHTMLAttributes<HTMLButtonElement>;
}
