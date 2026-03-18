import Link from "next/link";

interface FormationCardProps {
  title: string;
  description: string;
  href?: string;
  available?: boolean;
  label?: string;
  tags?: string[];
}

export function FormationCard({
  title,
  description,
  href,
  available = true,
  label,
  tags,
}: FormationCardProps) {
  const content = (
    <div className="relative flex h-full flex-col">
      {/* Bronze accent line for active */}
      {available && (
        <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-bronze via-bronze/40 to-transparent" />
      )}

      <div className={`flex-1 ${available ? "pl-8" : "pl-0"}`}>
        {label && (
          <span
            className={`mb-6 inline-block text-[10px] font-bold uppercase tracking-[0.2em] ${
              available ? "text-bronze" : "text-pierre/60"
            }`}
          >
            {label}
          </span>
        )}

        <h3
          className={`mb-4 font-serif text-2xl leading-snug transition-colors duration-500 md:text-3xl lg:text-4xl ${
            available
              ? "text-ivoire group-hover:text-bronze-clair"
              : "text-pierre/60"
          }`}
        >
          {title}
        </h3>

        <p
          className={`mb-8 max-w-md text-sm leading-relaxed ${
            available ? "text-cendre" : "text-pierre/40"
          }`}
        >
          {description}
        </p>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className={`border px-3 py-1 text-[10px] uppercase tracking-[0.15em] ${
                  available
                    ? "border-filet text-cendre"
                    : "border-filet-discret text-pierre/40"
                }`}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* CTA */}
      <div className={available ? "pl-8" : "pl-0"}>
        {available ? (
          <span className="inline-flex items-center gap-3 text-xs uppercase tracking-[0.15em] text-pierre transition-all duration-500 group-hover:gap-5 group-hover:text-bronze">
            En savoir plus
            <span className="inline-block h-px w-8 bg-current transition-all duration-500 group-hover:w-12" />
          </span>
        ) : (
          <span className="text-[10px] uppercase tracking-[0.2em] text-pierre/30">
            Prochainement
          </span>
        )}
      </div>
    </div>
  );

  if (available && href) {
    return (
      <Link
        href={href}
        className="group block border border-filet bg-graphite/60 p-8 transition-all duration-700 ease-[var(--ease-institutional)] hover:border-filet-accent hover:bg-ardoise/60 md:p-10 lg:p-12"
      >
        {content}
      </Link>
    );
  }

  return (
    <div
      className="block border border-filet-discret/50 bg-graphite/20 p-8 md:p-10 lg:p-12"
      aria-disabled="true"
    >
      {content}
    </div>
  );
}
