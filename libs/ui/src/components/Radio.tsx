import { cn } from "@reactive-resume/utils";
import { forwardRef } from "react";

export type RadioProps = {
  hasError?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>;

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ className, hasError = false, ...props }, ref) => (
    <input
      ref={ref}
      type="radio"
      className={cn(
        "h-4 w-4 cursor-pointer appearance-none rounded-full border border-border bg-transparent ring-1 ring-offset-transparent transition-all duration-200",
        "checked:border-primary checked:bg-primary checked:ring-2 checked:ring-primary",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1",
        "disabled:cursor-not-allowed disabled:opacity-50",
        hasError ? "border-error ring-error" : "border-border",
        className,
      )}
      {...props}
    />
  )
);

Radio.displayName = "Radio";
