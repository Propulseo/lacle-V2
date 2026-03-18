import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  size?: "sm" | "default";
  showLabel?: boolean;
}

export function ProgressBar({
  value,
  max = 100,
  className,
  size = "default",
  showLabel = false,
}: ProgressBarProps) {
  const percent = Math.min(Math.round((value / max) * 100), 100);

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div
        className={cn(
          "flex-1 overflow-hidden rounded-full bg-filet",
          size === "sm" ? "h-1.5" : "h-2.5"
        )}
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-or to-or-doux transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-medium text-cendre tabular-nums">{percent}%</span>
      )}
    </div>
  );
}
