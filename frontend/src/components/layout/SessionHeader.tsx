import type { ReviewSession } from "../../types/review";
import { CountPill } from "../shared/CountPill";
import { StatusBadge } from "../shared/StatusBadge";

type SessionHeaderProps = {
  session: ReviewSession;
  flaggedPairCount: number;
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

export function SessionHeader({ session, flaggedPairCount }: SessionHeaderProps) {
  return (
    <header className="session-header">
      <div className="session-header__identity" aria-label="IMF WEO identity placeholder">
        <div className="identity-mark" aria-hidden="true">
          WEO
        </div>
        <div>
          <p>IMF / WEO placeholder</p>
          <h1>Reviewing Assistant</h1>
        </div>
      </div>

      <div className="session-header__meta" aria-label="Review session summary">
        <div className="session-header__country">
          <span>{session.country.iso_code}</span>
          <strong>{session.country.name}</strong>
        </div>
        <CountPill label="Flagged pairs" value={flaggedPairCount} />
        <CountPill label="Quarterly data" value={session.has_quarterly_data ? "Yes" : "No"} />
        <StatusBadge tone="info">{session.submission.status_label}</StatusBadge>
      </div>

      <div className="session-header__tools">
        <button className="settings-button" type="button" aria-label="Display settings placeholder">
          Settings
        </button>
        <p>
          {session.submission.reviewer ?? "Reviewer"} · {formatTimestamp(session.submission.submission_timestamp)}
        </p>
      </div>
    </header>
  );
}
