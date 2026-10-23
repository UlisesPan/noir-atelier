export function AdminPageHeader({ title, description, actions }: { title: string; description?: string; actions?: React.ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-4xl sm:text-5xl">{title}</h1>
        {description && <p className="mt-2 text-sm text-muted">{description}</p>}
      </div>
      {actions}
    </div>
  );
}

export function Panel({ title, children, className = "" }: { title?: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={`rounded-[var(--radius-card)] border border-line bg-ivory p-6 shadow-soft ${className}`}>
      {title && <h2 className="mb-5 font-sans text-sm font-semibold tracking-wide">{title}</h2>}
      {children}
    </section>
  );
}
