import { cn } from "@/lib/utils";

interface SectionBlockProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
}

export function SectionBlock({ children, className, title, subtitle }: SectionBlockProps) {
  return (
    <section className={cn("py-12", className)}>
      {(title || subtitle) && (
        <div className="mb-8">
          {title && <h2 className="font-serif text-2xl text-ivoire">{title}</h2>}
          {subtitle && <p className="mt-2 text-cendre">{subtitle}</p>}
        </div>
      )}
      {children}
    </section>
  );
}
