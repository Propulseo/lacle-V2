"use client";

import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className, id, ...props }: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-sm text-cendre">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cn(
          "w-full rounded-lg border border-filet bg-encre px-4 py-2.5 text-sm text-ivoire placeholder:text-pierre transition-colors duration-200",
          "focus:border-or/50 focus:outline-none focus:ring-1 focus:ring-or/25",
          error && "border-erreur/50 focus:border-erreur focus:ring-erreur/25",
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-erreur">{error}</p>}
    </div>
  );
}
