import { cn } from "@/lib/utils";

const fieldBase =
  "w-full rounded-xl border border-line bg-white/70 px-4 text-sm text-ink placeholder:text-stone transition-colors outline-none focus:border-gold focus:bg-white focus:ring-4 focus:ring-gold/15 aria-[invalid=true]:border-danger aria-[invalid=true]:focus:ring-danger/10 disabled:opacity-60";

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(fieldBase, "h-12", className)} {...props} />;
}

export function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(fieldBase, "min-h-28 py-3", className)} {...props} />;
}

export function Select({ className, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        fieldBase,
        "h-12 cursor-pointer appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%23141211%22 stroke-width=%222%22><path d=%22m6 9 6 6 6-6%22/></svg>')] bg-[position:right_1rem_center] bg-no-repeat pr-10",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}

interface FieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}

/** Envuelve un control con label, ayuda y error accesibles. */
export function Field({ label, htmlFor, error, hint, className, children }: FieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label htmlFor={htmlFor} className="block text-xs font-semibold tracking-wide text-ink-soft">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${htmlFor}-error`} role="alert" className="text-xs text-danger">
          {error}
        </p>
      ) : (
        hint && <p className="text-xs text-stone">{hint}</p>
      )}
    </div>
  );
}
