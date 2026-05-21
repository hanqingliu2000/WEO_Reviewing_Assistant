type PanelProps = {
  title: string;
  eyebrow?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

export function Panel({ title, eyebrow, actions, children, className = "" }: PanelProps) {
  return (
    <section className={`panel ${className}`.trim()} aria-label={title}>
      <div className="panel__header">
        <div>
          {eyebrow ? <p className="panel__eyebrow">{eyebrow}</p> : null}
          <h2>{title}</h2>
        </div>
        {actions ? <div className="panel__actions">{actions}</div> : null}
      </div>
      <div className="panel__body">{children}</div>
    </section>
  );
}
