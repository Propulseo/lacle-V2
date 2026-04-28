"use client";

import Link from "next/link";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type ButtonVariant = "default" | "ghost" | "primary" | "danger";
type ButtonSize = "sm" | "default" | "lg";

interface ButtonBaseProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  isLoading?: boolean;
  icon?: React.ReactNode;
}

interface ButtonAsButton
  extends ButtonBaseProps,
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonBaseProps> {
  href?: never;
}

interface ButtonAsLink extends ButtonBaseProps {
  href: string;
}

type ButtonProps = ButtonAsButton | ButtonAsLink;

const base =
  "inline-flex items-center justify-center gap-2 font-body text-center tracking-wide transition-all duration-300 ease-[var(--ease-institutional)] disabled:opacity-50 disabled:cursor-not-allowed rounded-lg";

const variants: Record<ButtonVariant, string> = {
  default:
    "border border-filet text-ivoire hover:border-or/50 hover:text-or-doux",
  ghost:
    "text-cendre hover:text-ivoire hover:bg-ivoire/5",
  primary:
    "bg-or text-nuit font-medium hover:bg-or-doux",
  danger:
    "bg-erreur/10 text-erreur border border-erreur/20 hover:bg-erreur/20",
};

const sizes: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs",
  default: "px-5 py-2.5 text-sm",
  lg: "px-8 py-3.5 text-sm",
};

export function Button({
  children,
  variant = "default",
  size = "default",
  className = "",
  isLoading = false,
  icon,
  ...props
}: ButtonProps) {
  const classes = cn(base, variants[variant], sizes[size], className);

  const content = (
    <>
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : icon ? (
        <span className="shrink-0">{icon}</span>
      ) : null}
      {children}
    </>
  );

  if ("href" in props && props.href) {
    return (
      <Link href={props.href} className={classes}>
        {content}
      </Link>
    );
  }

  const { href: _, type = "button", ...buttonProps } = props as ButtonAsButton;
  return (
    <button type={type} className={classes} disabled={isLoading || buttonProps.disabled} {...buttonProps}>
      {content}
    </button>
  );
}
