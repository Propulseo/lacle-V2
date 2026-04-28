"use client";

import { cn } from "@/lib/utils";

export interface RadioChoiceOption {
  value: string;
  label: string;
}

interface RadioChoiceProps {
  name: string;
  legend: string;
  value: string;
  options: RadioChoiceOption[];
  onChange: (value: string) => void;
  columns?: 2 | 3;
}

/**
 * Groupe de choix radio stylé, cohérent avec les primitives `Input` / `Select`
 * du design system (encre + filet + accent or). Utilisé par le
 * `PreEnrollmentQuestionnaire` en attendant un `RadioGroup` mutualisé dans `ui/`.
 */
export function RadioChoice({
  name,
  legend,
  value,
  options,
  onChange,
  columns = 3,
}: RadioChoiceProps) {
  return (
    <fieldset className="space-y-3">
      <legend className="block text-sm text-cendre">{legend}</legend>
      <div
        className={cn(
          "grid gap-2",
          columns === 2 ? "sm:grid-cols-2" : "sm:grid-cols-3"
        )}
      >
        {options.map((opt) => {
          const isActive = value === opt.value;
          return (
            <label
              key={opt.value}
              className={cn(
                "flex cursor-pointer items-center gap-3 rounded-lg border bg-encre px-4 py-3 text-sm transition-colors duration-200",
                isActive
                  ? "border-or/50 text-ivoire ring-1 ring-or/25"
                  : "border-filet text-cendre hover:border-filet-accent hover:text-ivoire"
              )}
            >
              <input
                type="radio"
                name={name}
                value={opt.value}
                checked={isActive}
                onChange={() => onChange(opt.value)}
                className="sr-only"
              />
              <span
                aria-hidden="true"
                className={cn(
                  "inline-block h-2.5 w-2.5 shrink-0 rounded-full border transition-colors duration-200",
                  isActive ? "border-or bg-or" : "border-filet-accent"
                )}
              />
              <span>{opt.label}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
