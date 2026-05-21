import type { ReviewItem, ReviewSession } from "../../types/review";
import { CountPill } from "../shared/CountPill";
import { StatusBadge } from "../shared/StatusBadge";
import { Panel } from "./Panel";
import { SessionHeader } from "./SessionHeader";

type AppShellProps = {
  session: ReviewSession;
  reviewItems: ReviewItem[];
};

function countBySeverity(items: ReviewItem[]) {
  return items.reduce<Record<string, number>>((counts, item) => {
    counts[item.severity] = (counts[item.severity] ?? 0) + 1;
    return counts;
  }, {});
}

function uniqueSectors(items: ReviewItem[]) {
  return Array.from(new Map(items.map((item) => [item.sector_code, item.sector_name])).entries());
}

export function AppShell({ session, reviewItems }: AppShellProps) {
  const firstItem = reviewItems[0];
  const severityCounts = countBySeverity(reviewItems);
  const sectors = uniqueSectors(reviewItems);

  return (
    <main className="app-shell">
      <SessionHeader session={session} flaggedPairCount={reviewItems.length} />

      <div className="workbench-layout" aria-label="WEO review workbench">
        <Panel
          title="Review Queue"
          eyebrow="Navigation placeholder"
          actions={<StatusBadge tone="brand">All severities</StatusBadge>}
          className="workbench-panel workbench-panel--left"
        >
          <div className="severity-summary" aria-label="Severity summary">
            {Object.entries(severityCounts).map(([severity, count]) => (
              <CountPill key={severity} label={severity} value={count} />
            ))}
          </div>

          <div className="nav-section" aria-label="Sector placeholder list">
            <h3>Sectors</h3>
            <div className="sector-list">
              {sectors.slice(0, 6).map(([code, name], index) => (
                <button className={index === 0 ? "sector-row sector-row--active" : "sector-row"} key={code} type="button">
                  <span>{code}</span>
                  <strong>{name.replace(`${code} - `, "")}</strong>
                </button>
              ))}
            </div>
          </div>

          <div className="nav-section" aria-label="Validation placeholder">
            <h3>Selected validation</h3>
            <p>{firstItem.validation_name}</p>
          </div>
        </Panel>

        <Panel
          title="Review Surface"
          eyebrow="Active pair placeholder"
          actions={<StatusBadge tone="warning">{firstItem.flagged_data_point_count} flagged points</StatusBadge>}
          className="workbench-panel workbench-panel--center"
        >
          <div className="active-context">
            <div>
              <p>{firstItem.sector_name}</p>
              <h3>{firstItem.indicator_name}</h3>
            </div>
            <StatusBadge tone={firstItem.severity === "Critical" ? "warning" : "info"}>{firstItem.severity}</StatusBadge>
          </div>

          <div className="surface-strip" aria-label="Active review summary">
            <CountPill label="Validation" value={firstItem.validation_id.replaceAll("_", " ")} />
            <CountPill label="Flagged periods" value={firstItem.flagged_periods.join(", ")} />
            <CountPill label="Published series" value={firstItem.has_published ? "Available" : "Missing"} />
          </div>

          <div className="chart-placeholder" aria-label="Line chart placeholder">
            <div className="chart-grid" aria-hidden="true" />
            <div className="chart-line chart-line--previous" aria-hidden="true" />
            <div className="chart-line chart-line--current" aria-hidden="true" />
            <span>Line chart surface</span>
          </div>

          <div className="table-placeholder" aria-label="Current previous published table placeholder">
            <div className="table-row table-row--header">
              <span>Series</span>
              {["2024", "2025", "2026", "2027", "2028"].map((period) => (
                <span key={period}>{period}</span>
              ))}
            </div>
            {["Current", "Previous", "Published"].map((label) => (
              <div className="table-row" key={label}>
                <strong>{label}</strong>
                <span>112.4</span>
                <span className="flagged-cell">118.9</span>
                <span className="flagged-cell">123.2</span>
                <span>126.1</span>
                <span>129.6</span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel
          title="Active Draft"
          eyebrow="Draft placeholder"
          actions={<StatusBadge>Not kept</StatusBadge>}
          className="workbench-panel workbench-panel--right"
        >
          <div className="draft-context">
            <h3>{firstItem.indicator_name}</h3>
            <p>
              Draft generation, keep/edit state, and final output controls will attach here in later slices. This panel
              stays scoped to the active validation + indicator pair.
            </p>
          </div>

          <div className="draft-box" aria-label="Draft text placeholder">
            Could the team clarify the driver of the flagged movement in {firstItem.flagged_periods.join(", ")}?
          </div>

          <div className="draft-actions">
            <button type="button">Generate mock draft</button>
            <button type="button">Keep</button>
          </div>
        </Panel>
      </div>
    </main>
  );
}
