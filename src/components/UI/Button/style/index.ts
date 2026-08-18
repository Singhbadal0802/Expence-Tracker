import { cva } from "class-variance-authority";

export const brandPrimary = cva(
  "rounded-lg px-8 py-3 text-surface",
  {
    variants: {
      colorTone: {
        primary: "bg-primary",
        success: "bg-success",
        warning: "bg-warning",
        danger: "bg-danger",
      },
    },
    defaultVariants: {
      colorTone: "primary",
    },
  },
);

export const brandSecondary = cva("border border-2 rounded-lg px-8 py-3", {
  variants: {
    colorTone: {
      primary: "bg-primary/10 border-primary text-primary",
      success: "bg-success/10 border-success text-success",
      warning: "bg-warning/10 border-warning text-warning",
      danger: "bg-danger/10 border-danger text-danger",
    },
  },
  defaultVariants: {
    colorTone: "primary",
  },
});
