type CountPillProps = {
  label: string;
  value: number | string;
};

export function CountPill({ label, value }: CountPillProps) {
  return (
    <span className="inline-flex min-h-[26px] items-center gap-1.5 whitespace-nowrap rounded-md border border-[var(--color-border)] bg-white px-2 py-[5px] text-[11px] font-bold leading-none text-[var(--color-muted)]">
      <span>{label}</span>
      <strong className="text-xs text-[var(--color-ink)]">{value}</strong>
    </span>
  );
}
