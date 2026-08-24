import { cva } from "class-variance-authority";

export const icon = cva("p-2 border-dashed border-2 rounded-xl", {
  variants: {
    colorTone: {
      success: "bg-success/10 border-success",
      primary: "bg-primary/10 border-primary",
      danger: "bg-danger/10 border-danger",
      warning: "bg-warning/10 border-warning",
    },
  },
  defaultVariants: {
    colorTone: "primary",
  },
});

export const performanceText = cva("text-body1 font-semibold", {
  variants: {
    colorTone: {
      success: "text-success",
      primary: "text-primary",
      danger: "text-danger",
      warning: "text-warning",
    },
  },
  defaultVariants : {
    colorTone : "success"
  }
});
