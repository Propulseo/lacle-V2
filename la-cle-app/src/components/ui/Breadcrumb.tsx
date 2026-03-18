import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-1 text-sm">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1">
          {i > 0 && <ChevronRight className="h-3 w-3 text-pierre" />}
          {item.href ? (
            <Link
              href={item.href}
              className="text-cendre hover:text-ivoire transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-ivoire">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
