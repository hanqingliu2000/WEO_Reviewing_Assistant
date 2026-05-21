type PanelProps = {
  title: string;
  eyebrow?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  hideHeader?: boolean;
};

export function Panel({ title, eyebrow, actions, children, className = "", hideHeader = false }: PanelProps) {
  return (
    <section className={`panel ${className}`.trim()} aria-label={title}>
      {!hideHeader ? (
        <div className="panel__header">
          <div>
            {eyebrow ? <p className="panel__eyebrow">{eyebrow}</p> : null}
            <h2>{title}</h2>
          </div>
          {actions ? <div className="panel__actions">{actions}</div> : null}
        </div>
      ) : null}
      <div className="panel__body">{children}</div>
    </section>
  );
}
