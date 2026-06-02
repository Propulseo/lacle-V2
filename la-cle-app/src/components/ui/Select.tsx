"use client";

import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export function Select({ label, error, options, placeholder, className, id, ...props }: SelectProps) {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={selectId} className="block text-sm text-cendre">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={selectId}
          className={cn(
            "w-full rounded-lg border border-filet bg-encre px-4 py-2.5 pr-10 text-sm text-ivoire transition-colors duration-200 appearance-none",
            "focus:border-or/50 focus:outline-none focus:ring-1 focus:ring-or/25",
            error && "border-erreur/50 focus:border-erreur focus:ring-erreur/25",
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" className="text-pierre">
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-pierre" />
      </div>
      {error && <p className="text-xs text-erreur">{error}</p>}
    </div>
  );
}
