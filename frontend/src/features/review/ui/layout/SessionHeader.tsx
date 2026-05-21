import type { ReviewSession } from "../../types/review";

type SessionHeaderProps = {
  session: ReviewSession;
};

function formatTimestamp(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function SessionHeader({ session }: SessionHeaderProps) {
  return (
    <header className="grid min-h-[74px] items-center gap-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-panel)] p-3 shadow-[var(--shadow-panel)] [grid-template-columns:minmax(260px,0.9fr)_minmax(220px,1fr)_minmax(220px,0.7fr)] max-[1220px]:[grid-template-columns:minmax(220px,0.8fr)_minmax(360px,1.2fr)_minmax(180px,0.7fr)] max-[980px]:[grid-template-columns:1fr]">
      <div className="flex min-w-0 items-center gap-3" aria-label="IMF WEO identity placeholder">
        <div
          className="grid h-[46px] w-[46px] shrink-0 place-items-center rounded-md bg-[var(--color-brand-primary)] text-[15px] font-bold text-white"
          aria-hidden="true"
        >
          WEO
        </div>
        <div>
          <p className="text-[11px] font-bold uppercase text-[var(--color-subtle)]">IMF / WEO placeholder</p>
          <h1 className="mt-0.5 text-xl leading-[1.1]">Reviewing Assistant</h1>
        </div>
      </div>

      <div className="flex min-w-0 items-center justify-center gap-3 max-[980px]:justify-start" aria-label="Review session summary">
        <div className="min-w-[150px]">
          <span className="text-[11px] font-bold uppercase text-[var(--color-subtle)]">{session.country.iso_code}</span>
          <strong className="block overflow-hidden text-ellipsis whitespace-nowrap text-sm">{session.country.name}</strong>
        </div>
      </div>

      <div className="flex min-w-0 items-center justify-end gap-3 max-[980px]:justify-start">
        <button
          className="min-h-[30px] rounded-md border border-[var(--color-border-strong)] bg-[var(--color-panel)] px-2.5 py-[5px] text-xs font-bold text-[var(--color-ink)] hover:border-[var(--color-brand-primary)]"
          type="button"
          aria-label="Display settings placeholder"
        >
          Settings
        </button>
        <p className="text-right text-[11px] font-bold text-[var(--color-subtle)] max-[980px]:text-left">
          {session.submission.reviewer ?? "Reviewer"} · {formatTimestamp(session.submission.submission_timestamp)}
        </p>
      </div>
    </header>
  );
}
