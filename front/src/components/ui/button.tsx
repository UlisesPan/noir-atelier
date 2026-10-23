import Link from "next/link";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const VARIANTS = {
  primary: "bg-ink text-ivory hover:bg-ink-soft",
  gold: "bg-gold text-ink hover:bg-gold-light",
  outline: "border border-ink/15 bg-transparent text-ink hover:border-ink/40 hover:bg-ink/[0.03]",
  light: "bg-ivory text-ink hover:bg-white",
  ghost: "text-ink hover:bg-ink/5",
  danger: "bg-danger text-white hover:bg-danger/90",
  link: "h-auto px-0 text-ink underline-offset-4 hover:underline",
} as const;

const SIZES = {
  sm: "h-9 px-4 text-xs",
  md: "h-11 px-6 text-sm",
  lg: "h-13 px-8 text-sm",
  icon: "size-10",
} as const;

export type ButtonVariant = keyof typeof VARIANTS;
export type ButtonSize = keyof typeof SIZES;

export const buttonClasses = ({
  variant = "primary",
  size = "md",
  className,
}: { variant?: ButtonVariant; size?: ButtonSize; className?: string } = {}) =>
  cn(
    "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full font-semibold tracking-wide whitespace-nowrap transition-all duration-200 select-none",
    "disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
    VARIANTS[variant],
    variant !== "link" && SIZES[size],
    className,
  );

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

export function Button({ variant, size, loading, className, children, disabled, ...props }: ButtonProps) {
  return (
    <button className={buttonClasses({ variant, size, className })} disabled={disabled || loading} {...props}>
      {loading && <Loader2 className="size-4 animate-spin" aria-hidden />}
      {children}
    </button>
  );
}

interface ButtonLinkProps extends React.ComponentProps<typeof Link> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export function ButtonLink({ variant, size, className, ...props }: ButtonLinkProps) {
  return <Link className={buttonClasses({ variant, size, className })} {...props} />;
}
