import { useEffect, useMemo, useState } from "react";
import type { CSSProperties, PointerEvent } from "react";
import { Panel } from "../../../shared/ui/Panel";
import type { ReviewItem, ReviewItemDetail, ReviewSession } from "../types/review";
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

export function ReviewWorkspace({ session, reviewItems, reviewItemDetails }: ReviewWorkspaceProps) {
  const [activeReviewItemId, setActiveReviewItemId] = useState(reviewItems[0]?.review_item_id ?? "");
  const [decimalPlaces, setDecimalPlaces] = useState(1);
  const [fontSizeStep, setFontSizeStep] = useState(0);
  const [leftPanelWidth, setLeftPanelWidth] = useState(LEFT_PANEL_MIN_WIDTH);
  const [rightPanelWidth, setRightPanelWidth] = useState(280);
  const activeItem = useMemo(
    () => reviewItems.find((item) => item.review_item_id === activeReviewItemId) ?? reviewItems[0],
    [activeReviewItemId, reviewItems],
  );
  const activeDetail = activeItem ? reviewItemDetails[activeItem.review_item_id] : undefined;
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

  if (!activeItem || !activeDetail) {
    return null;
  }

  const deskExplanations = activeDetail.issue_report_entries;

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
        onIncreaseDecimalPlaces={() => setDecimalPlaces((current) => Math.min(3, current + 1))}
        onIncreaseFontSize={() => setFontSizeStep((current) => Math.min(4, current + 1))}
        session={session}
      />

      <div
        className="grid min-h-0 flex-1 gap-2 overflow-hidden [grid-template-columns:var(--left-panel-width,340px)_3px_minmax(520px,1fr)_3px_var(--right-panel-width,280px)] min-[2100px]:[grid-template-columns:var(--left-panel-width,340px)_3px_minmax(760px,1fr)_3px_var(--right-panel-width,280px)] max-[1220px]:[grid-template-columns:var(--left-panel-width,340px)_3px_minmax(460px,1fr)_3px_var(--right-panel-width,260px)] max-[980px]:grid max-[980px]:overflow-y-auto max-[980px]:[grid-template-columns:1fr]"
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
          <ReviewSurface activeDetail={activeDetail} activeItem={activeItem} decimalPlaces={decimalPlaces} />
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
          hideHeader
        >
          <div className="grid min-h-0 flex-1 grid-rows-[minmax(0,0.95fr)_minmax(0,1.05fr)] gap-3">
            <section className="grid min-h-0 content-start gap-2 overflow-auto pr-1" aria-label="Desk explanation">
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

            <section className="grid min-h-0 grid-rows-[auto_minmax(0,1fr)_auto] gap-2 border-t border-[var(--color-border)] pt-3" aria-label="Draft response area">
              <h3 className="text-[13px] font-extrabold uppercase tracking-[0.02em] text-[var(--color-subtle)]">
                Draft
              </h3>
              <div
                className="min-h-0 overflow-auto rounded-md border border-[var(--color-border)] bg-[var(--color-panel-muted)] p-3 text-[13px] leading-[1.55] text-[var(--color-ink)]"
                aria-label="Draft text placeholder"
              >
                Could the team clarify the driver of the flagged movement in {activeItem.flagged_periods.join(", ")}?
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  className="min-h-[30px] rounded-md border border-[#087443] bg-[#15945b] px-2.5 py-[5px] text-xs font-bold text-white hover:bg-[#087443]"
                  type="button"
                >
                  Keep
                </button>
                <button
                  className="min-h-[30px] rounded-md border border-[#d99a00] bg-[#f2c14e] px-2.5 py-[5px] text-xs font-bold text-[#3b2a00] hover:bg-[#e0ad29]"
                  type="button"
                >
                  Edit
                </button>
                <button
                  className="min-h-[30px] rounded-md border border-[var(--color-border-strong)] bg-white px-2.5 py-[5px] text-xs font-bold text-[var(--color-ink)] hover:border-[var(--color-brand-primary)]"
                  type="button"
                >
                  Skip
                </button>
              </div>
            </section>
          </div>
        </Panel>
      </div>
    </main>
  );
}
