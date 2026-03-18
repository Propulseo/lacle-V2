import Link from "next/link";

type ButtonVariant = "default" | "ghost";
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

const base =
  "inline-flex items-center justify-center font-body text-center tracking-[0.12em] uppercase transition-all duration-500 ease-[var(--ease-institutional)]";

const variants: Record<ButtonVariant, string> = {
  default:
    "border border-filet text-ivoire hover:border-bronze hover:text-bronze-clair",
  ghost:
    "text-cendre underline decoration-filet underline-offset-4 hover:text-ivoire hover:decoration-bronze",
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
