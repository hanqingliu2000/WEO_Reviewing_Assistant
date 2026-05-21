type StatusBadgeTone = "neutral" | "brand" | "info" | "warning";

type StatusBadgeProps = {
  children: React.ReactNode;
  tone?: StatusBadgeTone;
};

export function StatusBadge({ children, tone = "neutral" }: StatusBadgeProps) {
  const toneClass = {
    neutral: "bg-white text-[var(--color-muted)]",
    brand: "border-[rgb(0_76_151_/_30%)] bg-[var(--color-brand-bg)] text-[var(--color-brand-primary)]",
    info: "border-[rgb(0_156_222_/_28%)] bg-[var(--color-info-bg)] text-[#075f82]",
    warning: "border-[rgb(154_90_0_/_24%)] bg-[var(--color-warning-bg)] text-[var(--color-warning)]",
  }[tone];

  return (
    <span
      className={`inline-flex min-h-[26px] items-center gap-1.5 whitespace-nowrap rounded-md border border-[var(--color-border)] px-2 py-[5px] text-[11px] font-bold leading-none ${toneClass}`}
    >
      {children}
    </span>
  );
}
