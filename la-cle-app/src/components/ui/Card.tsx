import { cn } from "@/lib/utils";

type CardVariant = "default" | "elevated" | "interactive";

interface CardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  className?: string;
  onClick?: () => void;
}

const variantStyles: Record<CardVariant, string> = {
  default: "border border-filet bg-encre/50",
  elevated: "border border-filet bg-encre shadow-lg shadow-nuit-profond/50",
  interactive:
    "border border-filet bg-encre/50 hover:border-or/30 hover:bg-encre transition-all duration-300 cursor-pointer",
};

export function Card({ children, variant = "default", className, onClick }: CardProps) {
  return (
    <div
      className={cn("rounded-xl p-6", variantStyles[variant], className)}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === "Enter" && onClick() : undefined}
    >
      {children}
    </div>
  );
}
