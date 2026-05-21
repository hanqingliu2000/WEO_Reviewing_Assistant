type PanelProps = {
  title: string;
  eyebrow?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  bodyClassName?: string;
  className?: string;
  hideHeader?: boolean;
};

export function Panel({
  title,
  eyebrow,
  actions,
  children,
  bodyClassName = "overflow-auto",
  className = "",
  hideHeader = false,
}: PanelProps) {
  return (
    <section
      className={`flex min-h-0 min-w-0 flex-col overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-panel)] shadow-[var(--shadow-panel)] ${className}`.trim()}
      aria-label={title}
    >
      {!hideHeader ? (
        <div className="flex items-start justify-between gap-3 border-b border-[var(--color-border)] bg-[var(--color-panel-muted)] p-3">
          <div>
            {eyebrow ? (
              <p className="mb-[3px] text-[11px] font-bold uppercase text-[var(--color-subtle)]">{eyebrow}</p>
            ) : null}
            <h2 className="text-[17px] leading-[1.2]">{title}</h2>
          </div>
          {actions ? <div className="shrink-0">{actions}</div> : null}
        </div>
      ) : null}
      <div className={`flex min-h-0 flex-1 flex-col gap-4 p-3 ${bodyClassName}`}>
        {children}
      </div>
    </section>
  );
}
