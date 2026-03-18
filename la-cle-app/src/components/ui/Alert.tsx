import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle, AlertTriangle, Info } from "lucide-react";

type AlertVariant = "info" | "success" | "warning" | "error";

interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const config: Record<AlertVariant, { icon: React.ReactNode; styles: string }> = {
  info: {
    icon: <Info className="h-4 w-4" />,
    styles: "border-info/30 bg-info/5 text-info",
  },
  success: {
    icon: <CheckCircle className="h-4 w-4" />,
    styles: "border-succes/30 bg-succes/5 text-succes",
  },
  warning: {
    icon: <AlertTriangle className="h-4 w-4" />,
    styles: "border-attention/30 bg-attention/5 text-attention",
  },
  error: {
    icon: <AlertCircle className="h-4 w-4" />,
    styles: "border-erreur/30 bg-erreur/5 text-erreur",
  },
};

export function Alert({ variant = "info", title, children, className }: AlertProps) {
  const { icon, styles } = config[variant];
  return (
    <div className={cn("flex gap-3 rounded-lg border p-4", styles, className)}>
      <div className="shrink-0 mt-0.5">{icon}</div>
      <div className="text-sm">
        {title && <p className="font-medium">{title}</p>}
        <div className="opacity-80">{children}</div>
      </div>
    </div>
  );
}
