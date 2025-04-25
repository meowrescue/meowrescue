
// Restore and extend Progress bar: allow custom barColor and trackColor
import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "@/lib/utils";

interface ProgressProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  barColor?: string;
  trackColor?: string;
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(
  (
    { className, value, barColor = "#004080", trackColor = "#e6eff7", ...props },
    ref
  ) => (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        "relative h-3 w-full overflow-hidden rounded-full",
        className
      )}
      style={{
        background: trackColor,
      }}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className="h-full rounded-full transition-all"
        style={{
          width: `${value || 0}%`,
          background: barColor,
          minWidth: value !== undefined ? 4 : undefined,
        }}
      />
    </ProgressPrimitive.Root>
  )
);
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
