import { useEffect, useRef } from "react";
import type { ReviewItem, ReviewItemDetail, ReviewSession } from "../../types/review";
import { SeriesChart } from "../review-surface/SeriesChart";
import { CountPill } from "../shared/CountPill";
import { StatusBadge } from "../shared/StatusBadge";
import { Panel } from "./Panel";
import { SessionHeader } from "./SessionHeader";

type AppShellProps = {
  session: ReviewSession;
  reviewItems: ReviewItem[];
  activeDetail: ReviewItemDetail;
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

export function AppShell({ session, reviewItems, activeDetail }: AppShellProps) {
  const tableRef = useRef<HTMLDivElement>(null);
  const firstItem = reviewItems[0];
  const severityCounts = countBySeverity(reviewItems);
  const sectors = uniqueSectors(reviewItems);
  const tablePeriods = activeDetail.main_series.current.points.map((point) => point.period);
  const tableRows = [
    { label: "Current", points: activeDetail.main_series.current.points },
    { label: "Previous", points: activeDetail.main_series.previous.points },
    ...(activeDetail.main_series.published
      ? [{ label: "Published", points: activeDetail.main_series.published.points }]
      : []),
  ];
  const tableGridStyle = { gridTemplateColumns: `104px repeat(${tablePeriods.length}, 88px)` };

  useEffect(() => {
    if (tableRef.current) {
      tableRef.current.scrollLeft = tableRef.current.scrollWidth;
    }
  }, [activeDetail]);

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
          className="workbench-panel workbench-panel--center"
          hideHeader
        >
          <div className="active-context">
            <div>
              <p>
                {firstItem.sector_name} &gt; {firstItem.validation_name} &gt; {firstItem.indicator_name}
              </p>
              <h3>{firstItem.indicator_name}</h3>
            </div>
            <StatusBadge tone="warning">{firstItem.flagged_periods.length} flagged periods</StatusBadge>
          </div>

          <div className="table-placeholder" ref={tableRef} aria-label="Current previous published table placeholder">
            <div className="table-row table-row--header" style={tableGridStyle}>
              <span>Series</span>
              {tablePeriods.map((period) => (
                <span key={period}>{period}</span>
              ))}
            </div>
            {tableRows.map((row) => (
              <div className="table-row" key={row.label} style={tableGridStyle}>
                <strong>{row.label}</strong>
                {tablePeriods.map((period) => {
                  const value = row.points.find((point) => point.period === period)?.value;

                  return (
                    <span className={firstItem.flagged_periods.includes(period) ? "flagged-cell" : undefined} key={period}>
                      {value === null || value === undefined ? "n/a" : value.toFixed(1)}
                    </span>
                  );
                })}
              </div>
            ))}
          </div>

          <SeriesChart flaggedPeriods={firstItem.flagged_periods} seriesSet={activeDetail.main_series} />
        </Panel>

        <Panel
          title="Active Draft"
          className="workbench-panel workbench-panel--right"
          hideHeader
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
