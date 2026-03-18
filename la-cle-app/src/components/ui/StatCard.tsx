import { cn } from "@/lib/utils";
import { Card } from "./Card";

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: { value: string; positive?: boolean };
  className?: string;
}

export function StatCard({ label, value, icon, trend, className }: StatCardProps) {
  return (
    <Card className={cn("flex items-start justify-between", className)}>
      <div>
        <p className="text-sm text-cendre">{label}</p>
        <p className="mt-1 text-2xl font-serif text-ivoire">{value}</p>
        {trend && (
          <p
            className={cn(
              "mt-1 text-xs",
              trend.positive ? "text-succes" : "text-erreur"
            )}
          >
            {trend.value}
          </p>
        )}
      </div>
      {icon && (
        <div className="rounded-lg bg-or/10 p-2.5 text-or">{icon}</div>
      )}
    </Card>
  );
}
