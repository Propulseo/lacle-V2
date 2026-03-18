import Link from "next/link";

interface BackLinkProps {
  href: string;
  label?: string;
}

export function BackLink({ href, label = "Retour" }: BackLinkProps) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-2 text-xs tracking-[0.1em] uppercase text-pierre transition-colors duration-300 hover:text-cendre"
    >
      <span className="transition-transform duration-300 group-hover:-translate-x-1">
        &larr;
      </span>
      {label}
    </Link>
  );
}
