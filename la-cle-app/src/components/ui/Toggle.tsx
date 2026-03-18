"use client";

import { cn } from "@/lib/utils";

interface ToggleProps {
  enabled: boolean;
  onChange: (value: boolean) => void;
  label?: string;
  className?: string;
}

export function Toggle({ enabled, onChange, label, className }: ToggleProps) {
  return (
    <label className={cn("flex items-center gap-3 cursor-pointer", className)}>
      <button
        role="switch"
        aria-checked={enabled}
        onClick={() => onChange(!enabled)}
        className={cn(
          "relative h-6 w-11 rounded-full transition-colors duration-200",
          enabled ? "bg-or" : "bg-filet"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-ivoire transition-transform duration-200",
            enabled && "translate-x-5"
          )}
        />
      </button>
      {label && <span className="text-sm text-cendre">{label}</span>}
    </label>
  );
}
