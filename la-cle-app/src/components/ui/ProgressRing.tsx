import { cn } from "@/lib/utils";

interface ProgressRingProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  showLabel?: boolean;
  label?: string;
}

export function ProgressRing({
  value,
  max = 100,
  size = 80,
  strokeWidth = 6,
  className,
  showLabel = true,
  label,
}: ProgressRingProps) {
  const percent = Math.min(Math.round((value / max) * 100), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-filet)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-or)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700"
        />
      </svg>
      {showLabel && (
        <div className="absolute flex flex-col items-center">
          <span className="text-sm font-medium text-ivoire tabular-nums">{percent}%</span>
          {label && <span className="text-[10px] text-cendre">{label}</span>}
        </div>
      )}
    </div>
  );
}
