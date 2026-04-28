"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  readonly?: boolean;
  size?: "sm" | "default";
}

export function StarRating({ value, onChange, readonly = false, size = "default" }: StarRatingProps) {
  const iconSize = size === "sm" ? "h-4 w-4" : "h-6 w-6";

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          className={cn(
            "transition-colors",
            readonly ? "cursor-default" : "cursor-pointer hover:text-or"
          )}
        >
          <Star
            className={cn(
              iconSize,
              star <= value ? "fill-or text-or" : "text-filet"
            )}
          />
        </button>
      ))}
    </div>
  );
}
