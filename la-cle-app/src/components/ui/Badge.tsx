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

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
