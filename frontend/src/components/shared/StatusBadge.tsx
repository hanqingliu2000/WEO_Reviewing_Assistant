type StatusBadgeTone = "neutral" | "brand" | "info" | "warning";

type StatusBadgeProps = {
  children: React.ReactNode;
  tone?: StatusBadgeTone;
};

export function StatusBadge({ children, tone = "neutral" }: StatusBadgeProps) {
  return <span className={`status-badge status-badge--${tone}`}>{children}</span>;
}
