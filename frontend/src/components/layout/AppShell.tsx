import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, PointerEvent } from "react";
import type { ReviewItem, ReviewItemDetail, ReviewSession } from "../../types/review";
import { ReviewNavigator } from "../navigation/ReviewNavigator";
import { SeriesChart } from "../review-surface/SeriesChart";
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
  const tableRef = useRef<HTMLDivElement>(null);
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
    gridTemplateColumns: `104px repeat(${tablePeriods.length}, 88px)`,
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

  useEffect(() => {
    if (tableRef.current) {
      tableRef.current.scrollLeft = tableRef.current.scrollWidth;
    }
  }, [activeDetail]);

  if (!activeItem || !activeDetail) {
    return null;
  }

  return (
    <main className="flex h-screen flex-col gap-4 overflow-hidden bg-[var(--color-page)] p-4 text-[var(--color-ink)]">
      <SessionHeader session={session} />

      <div
        className="grid min-h-0 flex-1 gap-4 overflow-hidden [grid-template-columns:var(--left-panel-width,340px)_6px_minmax(480px,1fr)_minmax(260px,340px)] min-[2100px]:[grid-template-columns:var(--left-panel-width,340px)_6px_minmax(720px,1fr)_minmax(320px,420px)] max-[1220px]:[grid-template-columns:var(--left-panel-width,340px)_6px_minmax(420px,1fr)_minmax(230px,275px)] max-[980px]:[grid-template-columns:1fr]"
        aria-label="WEO review workbench"
        style={{
          "--left-panel-width": `${leftPanelWidth}px`,
        } as CSSProperties}
      >
        <Panel
          title="Review Queue"
          bodyClassName="overflow-hidden px-0 py-2"
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
          className="self-stretch touch-none cursor-col-resize rounded-sm hover:bg-[rgb(0_76_151_/_16%)] focus-visible:bg-[rgb(0_76_151_/_16%)] focus-visible:outline-none max-[980px]:hidden"
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
          bodyClassName="overflow-hidden"
          hideHeader
        >
          <div className="flex items-start justify-between gap-4 border-l-4 border-[var(--color-brand-primary)] bg-[var(--color-panel-muted)] p-3">
            <div>
              <p className="text-xs text-[var(--color-muted)]">
                {activeItem.sector_name} &gt; {activeItem.validation_name} &gt; {activeItem.indicator_name}
              </p>
              <h3 className="text-sm">{activeItem.indicator_name}</h3>
            </div>
            <StatusBadge tone="warning">{activeItem.flagged_periods.length} flagged periods</StatusBadge>
          </div>

          <div
            className="shrink-0 overflow-x-auto overflow-y-hidden rounded-md border border-[var(--color-border)] bg-white"
            ref={tableRef}
            aria-label="Current previous published table placeholder"
          >
            <div
              className="grid min-h-7 w-max min-w-full items-center border-t-0 bg-[var(--color-panel-muted)] text-[11px] font-extrabold uppercase text-[var(--color-muted)]"
              style={tableGridStyle}
            >
              <span className="sticky left-0 z-20 overflow-hidden bg-[var(--color-panel-muted)] px-2.5 py-[5px] text-ellipsis whitespace-nowrap shadow-[1px_0_0_var(--color-border)]">
                Series
              </span>
              {tablePeriods.map((period) => (
                <span className="overflow-hidden px-2.5 py-[5px] text-ellipsis whitespace-nowrap" key={period}>
                  {period}
                </span>
              ))}
            </div>
            {tableRows.map((row) => (
              <div
                className="grid min-h-7 w-max min-w-full items-center border-t border-[var(--color-border)]"
                key={row.label}
                style={tableGridStyle}
              >
                <strong className="sticky left-0 z-10 overflow-hidden bg-white px-2.5 py-[5px] text-ellipsis whitespace-nowrap shadow-[1px_0_0_var(--color-border)]">
                  {row.label}
                </strong>
                {tablePeriods.map((period) => {
                  const value = row.points.find((point) => point.period === period)?.value;

                  return (
                    <span
                      className={`overflow-hidden px-2.5 py-[5px] text-ellipsis whitespace-nowrap ${
                        activeItem.flagged_periods.includes(period)
                          ? "bg-[var(--color-warning-bg)] font-extrabold text-[var(--color-warning)]"
                          : ""
                      }`}
                      key={period}
                    >
                      {value === null || value === undefined ? "n/a" : value.toFixed(1)}
                    </span>
                  );
                })}
              </div>
            ))}
          </div>

          <SeriesChart flaggedPeriods={activeItem.flagged_periods} seriesSet={activeDetail.main_series} />
        </Panel>

        <Panel
          title="Active Draft"
          hideHeader
        >
          <div className="grid gap-2">
            <h3 className="text-sm">{activeItem.indicator_name}</h3>
            <p className="text-xs text-[var(--color-muted)]">
              Draft generation, keep/edit state, and final output controls will attach here in later slices. This panel
              stays scoped to the active validation + indicator pair.
            </p>
          </div>

          <div
            className="grid min-h-[210px] content-start gap-2 rounded-md border border-[var(--color-border)] bg-[var(--color-panel-muted)] p-3 text-[13px] leading-[1.55] text-[var(--color-ink)]"
            aria-label="Draft text placeholder"
          >
            Could the team clarify the driver of the flagged movement in {activeItem.flagged_periods.join(", ")}?
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              className="min-h-[30px] rounded-md border border-[var(--color-border-strong)] bg-[var(--color-panel)] px-2.5 py-[5px] text-xs font-bold text-[var(--color-ink)] hover:border-[var(--color-brand-primary)]"
              type="button"
            >
              Generate mock draft
            </button>
            <button
              className="min-h-[30px] rounded-md border border-[var(--color-border-strong)] bg-[var(--color-panel)] px-2.5 py-[5px] text-xs font-bold text-[var(--color-ink)] hover:border-[var(--color-brand-primary)]"
              type="button"
            >
              Keep
            </button>
          </div>
        </Panel>
      </div>
    </main>
  );
}
