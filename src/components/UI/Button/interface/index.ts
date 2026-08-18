export interface ButtonProps {
  variant: "brand-primary" | "brand-secondary";
  buttonLabel: string;
  onClick : () => void;
  tone : "primary" | "success" | "warning" | "danger";
}
