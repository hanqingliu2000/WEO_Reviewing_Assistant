type CountPillProps = {
  label: string;
  value: number | string;
};

export function CountPill({ label, value }: CountPillProps) {
  return (
    <span className="count-pill">
      <span>{label}</span>
      <strong>{value}</strong>
    </span>
  );
}
