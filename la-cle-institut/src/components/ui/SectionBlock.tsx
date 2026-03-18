interface SectionBlockProps {
  children: React.ReactNode;
  className?: string;
  background?: "noir" | "graphite";
  id?: string;
}

export function SectionBlock({
  children,
  className = "",
  background = "noir",
  id,
}: SectionBlockProps) {
  const bg = background === "graphite" ? "bg-graphite/50" : "";

  return (
    <section id={id} className={`py-20 md:py-28 lg:py-32 ${bg} ${className}`}>
      <div className="mx-auto max-w-[1200px] px-6 md:px-10 lg:px-16">
        {children}
      </div>
    </section>
  );
}
