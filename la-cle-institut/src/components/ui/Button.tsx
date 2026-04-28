import Link from "next/link";

/**
 * Variantes disponibles :
 *  - "default"  → bordure filet + hover bronze (version institutionnelle sobre)
 *  - "ghost"    → texte souligné discret
 *  - "elegant"  → variante raffinée (letter-spacing animé, sweep bronze,
 *                 soulignement qui s'étend depuis le centre au hover)
 *                 Pour revenir à la version précédente, repasser la prop
 *                 `variant="default"` ou supprimer la clé correspondante.
 *                 Les styles vivent dans globals.css → `.btn-elegant`.
 */
type ButtonVariant = "default" | "ghost" | "elegant";
type ButtonSize = "default" | "large";

interface ButtonBaseProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

interface ButtonAsButton extends ButtonBaseProps, Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonBaseProps> {
  href?: never;
}

interface ButtonAsLink extends ButtonBaseProps {
  href: string;
}

type ButtonProps = ButtonAsButton | ButtonAsLink;

/*
 * Le tracking et la transition sont portés par chaque variante pour que
 * `.btn-elegant` (globals.css) puisse gérer ses propres timings et son
 * letter-spacing sans conflit de spécificité avec `base`.
 */
const base =
  "inline-flex items-center justify-center font-body text-center uppercase";

const variants: Record<ButtonVariant, string> = {
  default:
    "tracking-[0.12em] transition-all duration-500 ease-[var(--ease-institutional)] border border-filet text-ivoire hover:border-bronze hover:text-bronze-clair",
  ghost:
    "tracking-[0.12em] transition-all duration-500 ease-[var(--ease-institutional)] text-cendre underline decoration-filet underline-offset-4 hover:text-ivoire hover:decoration-bronze",
  elegant: "btn-elegant",
};

const sizes: Record<ButtonSize, string> = {
  default: "px-8 py-3.5 text-xs",
  large: "px-12 py-5 text-sm",
};

export function Button({
  children,
  variant = "default",
  size = "default",
  className = "",
  ...props
}: ButtonProps) {
  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`;

  if ("href" in props && props.href) {
    return (
      <Link href={props.href} className={classes}>
        {children}
      </Link>
    );
  }

  const { href: _, ...buttonProps } = props as ButtonAsButton;
  return (
    <button className={classes} {...buttonProps}>
      {children}
    </button>
  );
}
