import { useMemo, useState } from "react";
import type { CSSProperties, PointerEvent } from "react";
import type { ReviewItem, ReviewItemDetail, ReviewSession } from "../../types/review";
import { CountPill } from "../shared/CountPill";
import { ReviewNavigator } from "../navigation/ReviewNavigator";
import { StatusBadge } from "../shared/StatusBadge";
import { Panel } from "./Panel";
import { SessionHeader } from "./SessionHeader";

type AppShellProps = {
  session: ReviewSession;
  reviewItems: ReviewItem[];
  reviewItemDetails: Record<string, ReviewItemDetail>;
};

const LEFT_PANEL_MIN_WIDTH = 240;
const LEFT_PANEL_MAX_WIDTH = 640;

export function AppShell({ session, reviewItems, reviewItemDetails }: AppShellProps) {
  const [activeReviewItemId, setActiveReviewItemId] = useState(reviewItems[0]?.review_item_id ?? "");
  const [leftPanelWidth, setLeftPanelWidth] = useState(340);
  const activeItem = useMemo(
    () => reviewItems.find((item) => item.review_item_id === activeReviewItemId) ?? reviewItems[0],
    [activeReviewItemId, reviewItems],
  );
  const activeDetail = activeItem ? reviewItemDetails[activeItem.review_item_id] : undefined;
  const tableRows = activeDetail
    ? [
        { label: "Current", points: activeDetail.main_series.current.points },
        { label: "Previous", points: activeDetail.main_series.previous.points },
        ...(activeDetail.main_series.published ? [{ label: "Published", points: activeDetail.main_series.published.points }] : []),
      ]
    : [];
  const tablePeriods = activeDetail?.main_series.current.points.map((point) => point.period) ?? [];
  const tableGridStyle = {
    gridTemplateColumns: `1.3fr repeat(${tablePeriods.length}, minmax(72px, 1fr))`,
  } as CSSProperties;
  const placeholderVisitedItemIds = useMemo(
    () => new Set(reviewItems.slice(1, 2).map((item) => item.review_item_id)),
    [reviewItems],
  );
  const placeholderKeptItemIds = useMemo(
    () => new Set(reviewItems.slice(5, 6).map((item) => item.review_item_id)),
    [reviewItems],
  );
  const placeholderEditedItemIds = useMemo(
    () => new Set(reviewItems.slice(7, 8).map((item) => item.review_item_id)),
    [reviewItems],
  );

  if (!activeItem || !activeDetail) {
    return null;
  }

  return (
    <main className="app-shell">
      <SessionHeader session={session} />

      <div
        className="workbench-layout"
        aria-label="WEO review workbench"
        style={{
          "--left-panel-width": `${leftPanelWidth}px`,
        } as CSSProperties}
      >
        <Panel
          title="Review Queue"
          className="workbench-panel workbench-panel--left"
          hideHeader
        >
          <ReviewNavigator
            activeReviewItemId={activeReviewItemId}
            editedItemIds={placeholderEditedItemIds}
            hasQuarterlyData={session.has_quarterly_data}
            keptItemIds={placeholderKeptItemIds}
            onActiveReviewItemIdChange={setActiveReviewItemId}
            reviewItems={reviewItems}
            visitedItemIds={placeholderVisitedItemIds}
          />
        </Panel>

        <div
          aria-label="Resize review navigation"
          className="panel-resizer"
          onPointerDown={(event: PointerEvent<HTMLDivElement>) => {
            event.currentTarget.setPointerCapture(event.pointerId);
            event.preventDefault();
          }}
          onPointerMove={(event: PointerEvent<HTMLDivElement>) => {
            if (event.buttons !== 1) {
              return;
            }

            const nextWidth = Math.min(Math.max(event.clientX - 16, LEFT_PANEL_MIN_WIDTH), LEFT_PANEL_MAX_WIDTH);
            setLeftPanelWidth(nextWidth);
          }}
          role="separator"
          tabIndex={0}
        />

        <Panel
          title="Review Surface"
          eyebrow="Active pair placeholder"
          actions={<StatusBadge tone="warning">{activeItem.flagged_data_point_count} flagged points</StatusBadge>}
          className="workbench-panel workbench-panel--center"
          hideHeader
        >
          <div className="active-context">
            <div>
              <p>{activeItem.sector_name}</p>
              <h3>{activeItem.indicator_name}</h3>
            </div>
            <StatusBadge tone={activeItem.severity === "Critical" ? "warning" : "info"}>{activeItem.severity}</StatusBadge>
          </div>

          <div className="surface-strip" aria-label="Active review summary">
            <CountPill label="Validation" value={activeItem.validation_id.replaceAll("_", " ")} />
            <CountPill label="Flagged periods" value={activeItem.flagged_periods.join(", ")} />
            <CountPill label="Published series" value={activeItem.has_published ? "Available" : "Missing"} />
          </div>

          <div className="table-placeholder" aria-label="Current previous published table placeholder">
            <div className="table-row table-row--header">
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
                    <span className={activeItem.flagged_periods.includes(period) ? "flagged-cell" : undefined} key={period}>
                      {value === null || value === undefined ? "n/a" : value.toFixed(1)}
                    </span>
                  );
                })}
              </div>
            ))}
          </div>

          <div className="chart-placeholder" aria-label="Line chart placeholder">
            <div className="chart-grid" aria-hidden="true" />
            <div className="chart-line chart-line--previous" aria-hidden="true" />
            <div className="chart-line chart-line--current" aria-hidden="true" />
            <span>Line chart surface</span>
          </div>
        </Panel>

        <Panel
          title="Active Draft"
          className="workbench-panel workbench-panel--right"
          hideHeader
        >
          <div className="draft-context">
            <h3>{activeItem.indicator_name}</h3>
            <p>
              Draft generation, keep/edit state, and final output controls will attach here in later slices. This panel
              stays scoped to the active validation + indicator pair.
            </p>
          </div>

          <div className="draft-box" aria-label="Draft text placeholder">
            Could the team clarify the driver of the flagged movement in {activeItem.flagged_periods.join(", ")}?
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
