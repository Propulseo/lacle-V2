import { CheckCircle, AlertTriangle, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "success" | "error" | "warning" | "info" | "gold";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-ivoire/10 text-ivoire",
  success: "bg-succes/10 text-succes",
  error: "bg-erreur/10 text-erreur",
  warning: "bg-attention/10 text-attention",
  info: "bg-info/10 text-info",
  gold: "bg-or/10 text-or",
};

const variantIcons: Partial<Record<BadgeVariant, React.ReactNode>> = {
  success: <CheckCircle aria-hidden="true" className="h-3 w-3 shrink-0" />,
  error: <AlertTriangle aria-hidden="true" className="h-3 w-3 shrink-0" />,
  warning: <AlertCircle aria-hidden="true" className="h-3 w-3 shrink-0" />,
  info: <Info aria-hidden="true" className="h-3 w-3 shrink-0" />,
};

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
        variantStyles[variant],
        className
      )}
    >
      {variantIcons[variant]}
      {children}
    </span>
  );
}
