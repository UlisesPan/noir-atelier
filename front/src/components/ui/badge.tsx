import { cn } from "@/lib/utils";

const TONES = {
  neutral: "bg-ink/5 text-ink-soft",
  dark: "bg-ink text-ivory",
  gold: "bg-gold/15 text-gold-dark",
  success: "bg-success/10 text-success",
  danger: "bg-danger/10 text-danger",
  info: "bg-sky-900/10 text-sky-900",
} as const;

export type BadgeTone = keyof typeof TONES;

export function Badge({
  tone = "neutral",
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { tone?: BadgeTone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[0.68rem] font-semibold tracking-wider uppercase",
        TONES[tone],
        className,
      )}
      {...props}
    />
  );
}
