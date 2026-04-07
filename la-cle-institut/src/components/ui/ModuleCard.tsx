interface ModuleCardProps {
  number: number;
  title: string;
  description: string;
}

export function ModuleCard({ number, title, description }: ModuleCardProps) {
  return (
    <div className="card-elevated group relative border border-filet bg-graphite/40 p-6 transition-all duration-500 hover:border-filet-accent hover:bg-ardoise/50 md:p-8">
      {/* Large background number */}
      <span
        className="pointer-events-none absolute right-4 top-3 font-display text-[5rem] font-light leading-none text-ivoire/[0.03] transition-colors duration-500 group-hover:text-bronze/[0.06] md:right-6 md:top-4 md:text-[6rem]"
        aria-hidden="true"
      >
        {String(number).padStart(2, "0")}
      </span>

      {/* Content */}
      <div className="relative">
        <span className="mb-4 inline-block text-label text-bronze/60">
          Module {String(number).padStart(2, "0")}
        </span>
        <h4 className="mb-3 font-display text-xl text-ivoire transition-colors duration-500 group-hover:text-bronze-clair md:text-2xl">
          {title}
        </h4>
        <p className="text-sm leading-relaxed text-cendre/80">{description}</p>
      </div>

      {/* Bottom accent line */}
      <div className="mt-6 h-px w-8 bg-filet transition-all duration-500 group-hover:w-12 group-hover:bg-bronze/40" />
    </div>
  );
}
