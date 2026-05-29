import { useCallback, useEffect, useMemo, useState } from "react";
import type { CSSProperties, PointerEvent } from "react";
import { Panel } from "../../../shared/ui/Panel";
import type { HighlightPeriodPayload, ReviewItem, ReviewItemDetail, ReviewSession } from "../types/review";
import { SessionHeader } from "./layout/SessionHeader";
import { ReviewNavigator } from "./navigation/ReviewNavigator";
import { ReviewSurface } from "./review-surface/ReviewSurface";

type ReviewWorkspaceProps = {
  session: ReviewSession;
  reviewItems: ReviewItem[];
  reviewItemDetails: Record<string, ReviewItemDetail>;
};

const LEFT_PANEL_MIN_WIDTH = 280;
const LEFT_PANEL_ABSOLUTE_MAX_WIDTH = 420;
const RIGHT_PANEL_MIN_WIDTH = 220;
const RIGHT_PANEL_ABSOLUTE_MAX_WIDTH = 380;

function getLeftPanelMaxWidth() {
  if (typeof window === "undefined") {
    return LEFT_PANEL_ABSOLUTE_MAX_WIDTH;
  }

  return Math.max(LEFT_PANEL_MIN_WIDTH, Math.min(LEFT_PANEL_ABSOLUTE_MAX_WIDTH, Math.floor(window.innerWidth / 3)));
}

function clampLeftPanelWidth(width: number) {
  return Math.min(Math.max(width, LEFT_PANEL_MIN_WIDTH), getLeftPanelMaxWidth());
}

function getRightPanelMaxWidth() {
  if (typeof window === "undefined") {
    return RIGHT_PANEL_ABSOLUTE_MAX_WIDTH;
  }

  return Math.max(RIGHT_PANEL_MIN_WIDTH, Math.min(RIGHT_PANEL_ABSOLUTE_MAX_WIDTH, Math.floor(window.innerWidth / 3)));
}

function clampRightPanelWidth(width: number) {
  return Math.min(Math.max(width, RIGHT_PANEL_MIN_WIDTH), getRightPanelMaxWidth());
}

function getPeriodRange(periods: string[], startPeriod: string, endPeriod: string) {
  const startIndex = periods.indexOf(startPeriod);
  const endIndex = periods.indexOf(endPeriod);

  if (startIndex === -1 || endIndex === -1) {
    return [];
  }

  const [rangeStart, rangeEnd] = startIndex <= endIndex ? [startIndex, endIndex] : [endIndex, startIndex];
  return periods.slice(rangeStart, rangeEnd + 1);
}

function sortPeriodsByDisplayOrder(periods: string[], periodOrder: string[]) {
  const periodSet = new Set(periods);
  return periodOrder.filter((period) => periodSet.has(period));
}

function createDefaultHighlightPayload(reviewItem: ReviewItem): HighlightPeriodPayload {
  return {
    highlighted_periods: reviewItem.flagged_periods,
    review_item_id: reviewItem.review_item_id,
    source: "default_flagged",
    updated_at: new Date().toISOString(),
  };
}

export function ReviewWorkspace({ session, reviewItems, reviewItemDetails }: ReviewWorkspaceProps) {
  const [activeReviewItemId, setActiveReviewItemId] = useState(reviewItems[0]?.review_item_id ?? "");
  const [decimalPlaces, setDecimalPlaces] = useState(1);
  const [fontSizeStep, setFontSizeStep] = useState(0);
  const [leftPanelWidth, setLeftPanelWidth] = useState(LEFT_PANEL_MIN_WIDTH);
  const [rightPanelWidth, setRightPanelWidth] = useState(280);
  const [draftText, setDraftText] = useState("");
  const [highlightSessions, setHighlightSessions] = useState<Record<string, HighlightPeriodPayload>>({});
  const [evidenceOptions, setEvidenceOptions] = useState({
    table: false,
    chart: true,
    relatedIndicators: false,
  });
  const [lastRaisedReviewItemId, setLastRaisedReviewItemId] = useState<string | null>(null);
  const activeItem = useMemo(
    () => reviewItems.find((item) => item.review_item_id === activeReviewItemId) ?? reviewItems[0],
    [activeReviewItemId, reviewItems],
  );
  const activeDetail = activeItem ? reviewItemDetails[activeItem.review_item_id] : undefined;
  const activePeriodOrder = useMemo(
    () => activeDetail?.main_series.current.points.map((point) => point.period) ?? [],
    [activeDetail],
  );
  const highlightPayload = useMemo<HighlightPeriodPayload | null>(() => {
    if (!activeItem) {
      return null;
    }

    const storedPayload = highlightSessions[activeItem.review_item_id] ?? createDefaultHighlightPayload(activeItem);

    return {
      ...storedPayload,
      highlighted_periods: sortPeriodsByDisplayOrder(storedPayload.highlighted_periods, activePeriodOrder),
    };
  }, [activeItem, activePeriodOrder, highlightSessions]);
  const sortedHighlightedPeriods = highlightPayload?.highlighted_periods ?? [];
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
    const handleResize = () => {
      setLeftPanelWidth((currentWidth) => clampLeftPanelWidth(currentWidth));
      setRightPanelWidth((currentWidth) => clampRightPanelWidth(currentWidth));
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (!activeItem) {
      return;
    }

    setDraftText(`Could the team clarify the driver of the flagged movement in ${activeItem.flagged_periods.join(", ")}?`);
    setEvidenceOptions({
      table: false,
      chart: true,
      relatedIndicators: false,
    });
    setLastRaisedReviewItemId(null);
  }, [activeItem]);

  const addHighlightedPeriodRange = useCallback((startPeriod: string, endPeriod: string) => {
    if (!activeItem) {
      return;
    }

    const range = getPeriodRange(activePeriodOrder, startPeriod, endPeriod);

    if (!range.length) {
      return;
    }

    setHighlightSessions((currentSessions) => {
      const currentPayload = currentSessions[activeItem.review_item_id] ?? createDefaultHighlightPayload(activeItem);

      return {
        ...currentSessions,
        [activeItem.review_item_id]: {
          highlighted_periods: sortPeriodsByDisplayOrder(
            [...new Set([...currentPayload.highlighted_periods, ...range])],
            activePeriodOrder,
          ),
          review_item_id: activeItem.review_item_id,
          source: "user_modified",
          updated_at: new Date().toISOString(),
        },
      };
    });
  }, [activeItem, activePeriodOrder]);

  const removeHighlightedPeriodRange = useCallback((startPeriod: string, endPeriod: string) => {
    if (!activeItem) {
      return;
    }

    const range = new Set(getPeriodRange(activePeriodOrder, startPeriod, endPeriod));

    if (!range.size) {
      return;
    }

    setHighlightSessions((currentSessions) => {
      const currentPayload = currentSessions[activeItem.review_item_id] ?? createDefaultHighlightPayload(activeItem);

      return {
        ...currentSessions,
        [activeItem.review_item_id]: {
          highlighted_periods: sortPeriodsByDisplayOrder(
            currentPayload.highlighted_periods.filter((period) => !range.has(period)),
            activePeriodOrder,
          ),
          review_item_id: activeItem.review_item_id,
          source: "user_modified",
          updated_at: new Date().toISOString(),
        },
      };
    });
  }, [activeItem, activePeriodOrder]);

  const toggleHighlightedPeriod = useCallback((period: string) => {
    if (!activeItem) {
      return;
    }

    if (!activePeriodOrder.includes(period)) {
      return;
    }

    setHighlightSessions((currentSessions) => {
      const currentPayload = currentSessions[activeItem.review_item_id] ?? createDefaultHighlightPayload(activeItem);
      const periodSet = new Set(currentPayload.highlighted_periods);

      if (periodSet.has(period)) {
        periodSet.delete(period);
      } else {
        periodSet.add(period);
      }

      return {
        ...currentSessions,
        [activeItem.review_item_id]: {
          highlighted_periods: sortPeriodsByDisplayOrder([...periodSet], activePeriodOrder),
          review_item_id: activeItem.review_item_id,
          source: "user_modified",
          updated_at: new Date().toISOString(),
        },
      };
    });
  }, [activeItem, activePeriodOrder]);

  if (!activeItem || !activeDetail) {
    return null;
  }

  const deskExplanations = activeDetail.issue_report_entries;

  function raiseDraft() {
    const trimmedDraftText = draftText.trim();

    if (!trimmedDraftText) {
      return;
    }

    // Placeholder for the future backend call. The payload shape mirrors what the API should receive.
    const raisePayload = {
      evidence: evidenceOptions,
      highlight_periods: highlightPayload,
      review_item_id: activeItem.review_item_id,
      text: trimmedDraftText,
    };
    void raisePayload;
    setLastRaisedReviewItemId(activeItem.review_item_id);
  }

  return (
    <main
      className="review-workspace flex h-screen flex-col gap-4 overflow-hidden bg-[var(--color-page)] p-4 text-[var(--color-ink)]"
      style={
        {
          "--font-step": `${fontSizeStep}px`,
          "--row-extra": `${fontSizeStep * 2}px`,
        } as CSSProperties
      }
    >
      <SessionHeader
        decimalPlaces={decimalPlaces}
        fontSizeStep={fontSizeStep}
        onDecreaseDecimalPlaces={() => setDecimalPlaces((current) => Math.max(0, current - 1))}
        onDecreaseFontSize={() => setFontSizeStep((current) => Math.max(0, current - 1))}
        onIncreaseDecimalPlaces={() => setDecimalPlaces((current) => Math.min(9, current + 1))}
        onIncreaseFontSize={() => setFontSizeStep((current) => Math.min(4, current + 1))}
        session={session}
      />

      <div
        className="font-scale-root grid min-h-0 flex-1 gap-2 overflow-hidden [grid-template-columns:var(--left-panel-width,340px)_3px_minmax(520px,1fr)_3px_var(--right-panel-width,280px)] min-[2100px]:[grid-template-columns:var(--left-panel-width,340px)_3px_minmax(760px,1fr)_3px_var(--right-panel-width,280px)] max-[1220px]:[grid-template-columns:var(--left-panel-width,340px)_3px_minmax(460px,1fr)_3px_var(--right-panel-width,260px)] max-[980px]:grid max-[980px]:overflow-y-auto max-[980px]:[grid-template-columns:1fr]"
        aria-label="WEO review workbench"
        style={{
          "--left-panel-width": `${leftPanelWidth}px`,
          "--right-panel-width": `${rightPanelWidth}px`,
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
          className="self-stretch touch-none cursor-col-resize rounded-sm bg-[var(--color-border)] opacity-60 transition-colors hover:bg-[var(--color-brand-primary)] hover:opacity-100 focus-visible:bg-[var(--color-brand-primary)] focus-visible:opacity-100 focus-visible:outline-none max-[980px]:hidden"
          onPointerDown={(event: PointerEvent<HTMLDivElement>) => {
            event.currentTarget.setPointerCapture(event.pointerId);
            event.preventDefault();
          }}
          onPointerMove={(event: PointerEvent<HTMLDivElement>) => {
            if (event.buttons !== 1) {
              return;
            }

            const nextWidth = clampLeftPanelWidth(event.clientX - 16);
            setLeftPanelWidth(nextWidth);
          }}
          role="separator"
          tabIndex={0}
        />

        <Panel
          title="Review Surface"
          bodyClassName="overflow-auto [padding:8px] [row-gap:8px]"
          className="max-[980px]:max-h-[calc(100vh-120px)]"
          hideHeader
        >
          <ReviewSurface
            activeDetail={activeDetail}
            activeItem={activeItem}
            decimalPlaces={decimalPlaces}
            highlightedPeriods={sortedHighlightedPeriods}
            onAddHighlightedPeriodRange={addHighlightedPeriodRange}
            onRemoveHighlightedPeriodRange={removeHighlightedPeriodRange}
            onToggleHighlightedPeriod={toggleHighlightedPeriod}
          />
        </Panel>

        <div
          aria-label="Resize active draft"
          className="self-stretch touch-none cursor-col-resize rounded-sm bg-[var(--color-border)] opacity-60 transition-colors hover:bg-[var(--color-brand-primary)] hover:opacity-100 focus-visible:bg-[var(--color-brand-primary)] focus-visible:opacity-100 focus-visible:outline-none max-[980px]:hidden"
          onPointerDown={(event: PointerEvent<HTMLDivElement>) => {
            event.currentTarget.setPointerCapture(event.pointerId);
            event.preventDefault();
          }}
          onPointerMove={(event: PointerEvent<HTMLDivElement>) => {
            if (event.buttons !== 1) {
              return;
            }

            const nextWidth = clampRightPanelWidth(window.innerWidth - event.clientX - 16);
            setRightPanelWidth(nextWidth);
          }}
          role="separator"
          tabIndex={0}
        />

        <Panel
          title="Active Draft"
          bodyClassName="overflow-hidden p-3"
          className="min-w-0"
          hideHeader
        >
          <div className="grid min-h-0 min-w-0 flex-1 grid-rows-[minmax(0,0.95fr)_minmax(0,1.05fr)] gap-3">
            <section className="grid min-h-0 min-w-0 content-start gap-2 overflow-auto pr-1" aria-label="Desk explanation">
              <h3 className="text-[13px] font-extrabold uppercase tracking-[0.02em] text-[var(--color-subtle)]">
                Desk Explanation
              </h3>
              {deskExplanations.length ? (
                <div className="grid gap-2 text-[12px] leading-[1.4] text-[var(--color-ink)]">
                  {deskExplanations.map((entry) => (
                    <article className="rounded-md bg-[var(--color-panel-muted)] p-2" key={entry.issue_report_entry_id}>
                      <p className="mb-1 text-[10px] font-extrabold uppercase text-[var(--color-subtle)]">
                        {entry.period_range}
                      </p>
                      <p>{entry.explanation}</p>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="text-[12px] leading-[1.4] text-[var(--color-muted)]">
                  No prior desk explanation is available in the mock issues report for this item.
                </p>
              )}
            </section>

            <section className="grid min-h-0 min-w-0 grid-rows-[auto_minmax(0,1fr)_auto] gap-2 border-t border-[var(--color-border)] pt-3" aria-label="Draft response area">
              <h3 className="text-[13px] font-extrabold uppercase tracking-[0.02em] text-[var(--color-subtle)]">
                Draft
              </h3>
              <textarea
                className="min-h-0 resize-none rounded-md border border-[var(--color-border)] bg-[var(--color-panel-muted)] p-3 text-[13px] leading-[1.55] text-[var(--color-ink)] outline-none focus:border-[var(--color-brand-primary)]"
                aria-label="Draft text"
                onChange={(event) => setDraftText(event.target.value)}
                onKeyDown={(event) => {
                  if (event.ctrlKey && event.key === "Enter") {
                    event.preventDefault();
                    raiseDraft();
                  }
                }}
                value={draftText}
              />

              <div className="grid min-w-0 gap-2">
                <div className="grid min-w-0 grid-cols-[auto_minmax(0,1fr)] items-center gap-2">
                  <button
                    className="min-h-[30px] rounded-md border border-[#d99a00] bg-[#f2c14e] px-3 py-[5px] text-xs font-extrabold text-[#3b2a00] hover:bg-[#e0ad29] disabled:cursor-default disabled:opacity-50"
                    disabled={!draftText.trim()}
                    onClick={raiseDraft}
                    type="button"
                  >
                    Raise
                  </button>
                  <div className="grid min-w-0 grid-cols-[minmax(0,auto)_minmax(0,auto)] items-center justify-start gap-x-2 gap-y-1 overflow-hidden">
                    {[
                      ["table", "Table", ""],
                      ["chart", "Chart", ""],
                      ["relatedIndicators", "Related indicators", "col-span-2"],
                    ].map(([key, label, className]) => (
                      <label
                        className={`flex min-h-[18px] min-w-0 max-w-full items-center gap-1.5 text-[11px] font-bold leading-none text-[var(--color-ink)] ${className}`.trim()}
                        key={key}
                      >
                        <input
                          className="shrink-0"
                          checked={evidenceOptions[key as keyof typeof evidenceOptions]}
                          onChange={(event) =>
                            setEvidenceOptions((current) => ({
                              ...current,
                              [key]: event.target.checked,
                            }))
                          }
                          type="checkbox"
                        />
                        <span className="min-w-0 whitespace-normal leading-[1.15]">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <p className="min-h-4 text-[11px] text-[var(--color-muted)]" aria-live="polite">
                  {lastRaisedReviewItemId === activeItem.review_item_id
                    ? "Draft marked to raise with the selected evidence."
                    : "Ctrl+Enter also raises the current draft."}
                </p>
              </div>
            </section>
          </div>
        </Panel>
      </div>
    </main>
  );
}
