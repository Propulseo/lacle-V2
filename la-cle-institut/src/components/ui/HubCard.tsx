import Link from "next/link";

interface HubCardProps {
  title: string;
  description: string;
  href: string;
}

export function HubCard({ title, description, href }: HubCardProps) {
  return (
    <Link
      href={href}
      className="group block border border-filet bg-ardoise/40 p-8 transition-all duration-500 ease-[var(--ease-institutional)] hover:-translate-y-1 hover:border-filet-accent md:p-10"
    >
      <h3 className="mb-4 font-serif text-2xl text-ivoire transition-colors duration-500 group-hover:text-bronze-clair md:text-3xl">
        {title}
      </h3>
      <p className="mb-6 text-sm leading-relaxed text-cendre">
        {description}
      </p>
      <span className="inline-block text-xs uppercase tracking-[0.15em] text-pierre transition-all duration-500 group-hover:translate-x-2 group-hover:text-bronze">
        Découvrir &rarr;
      </span>
    </Link>
  );
}
