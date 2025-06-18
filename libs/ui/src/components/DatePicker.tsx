import { cn } from "@reactive-resume/utils";
import { forwardRef } from "react";

export type DatePickerProps = {
  hasError?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>;

export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  ({ className, hasError = false, ...props }, ref) => (
    <input
      ref={ref}
      type="date"
      className={cn(
        "flex h-9 w-full rounded border border-border bg-transparent px-3 py-0.5 text-sm ring-0 ring-offset-transparent transition-colors",
        "hover:bg-secondary/20 focus:border-primary focus:bg-secondary/20 focus-visible:outline-none focus-visible:ring-0",
        "disabled:cursor-not-allowed disabled:opacity-50",
        hasError ? "border-error" : "border-border",
        className,
      )}
      {...props}
    />
  )
);

DatePicker.displayName = "DatePicker";
