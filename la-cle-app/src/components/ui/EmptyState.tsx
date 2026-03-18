import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-16 text-center", className)}>
      {icon && <div className="mb-4 text-pierre">{icon}</div>}
      <h3 className="font-serif text-xl text-ivoire">{title}</h3>
      {description && <p className="mt-2 max-w-sm text-sm text-cendre">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
