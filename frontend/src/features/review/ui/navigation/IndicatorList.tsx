import type { ReviewItem } from "../../types/review";

type IndicatorListProps = {
  activeReviewItemId: string;
  editedItemIds?: ReadonlySet<string>;
  indicators: ReviewItem[];
  keptItemIds?: ReadonlySet<string>;
  onActivateReviewItem: (reviewItemId: string) => void;
  visitedItemIds?: ReadonlySet<string>;
};

export function IndicatorList({
  activeReviewItemId,
  editedItemIds,
  indicators,
  keptItemIds,
  onActivateReviewItem,
  visitedItemIds,
}: IndicatorListProps) {
  return (
    <div
      className="relative ml-6 grid gap-0.5 pl-3 before:absolute before:top-0 before:bottom-2 before:left-0 before:w-px before:bg-[var(--color-border)]"
      role="group"
    >
      {indicators.map((item) => {
        const isActive = item.review_item_id === activeReviewItemId;
        const isVisited = visitedItemIds?.has(item.review_item_id);
        const isKept = keptItemIds?.has(item.review_item_id);
        const isEdited = editedItemIds?.has(item.review_item_id);
        const statusLabel = isEdited ? "Edited issue" : isKept ? "Kept issue" : undefined;

        return (
          <button
            aria-current={isActive ? "true" : undefined}
            className={`grid min-h-[30px] w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-2 rounded-sm border bg-transparent p-1.5 pl-2 text-left transition-colors hover:border-[var(--color-brand-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand-secondary)] ${
              isActive
                ? "border-[rgb(0_76_151_/_20%)] bg-[var(--color-brand-bg)] text-[var(--color-ink)]"
                : "border-transparent text-[var(--color-ink)]"
            } ${isVisited ? "text-[var(--color-subtle)]" : ""}`}
            data-tree-row="true"
            key={item.review_item_id}
            onClick={() => onActivateReviewItem(item.review_item_id)}
            type="button"
          >
            <strong className="[overflow-wrap:anywhere] text-xs leading-[1.3] whitespace-normal" title={item.indicator_name}>
              {item.indicator_id}
            </strong>
            {statusLabel ? (
              <span
                aria-label={statusLabel}
                className={`inline-grid h-[22px] w-[22px] place-items-center justify-self-end rounded-full text-[13px] font-extrabold ${
                  isEdited
                    ? "bg-[var(--color-info-bg)] text-[#075f82]"
                    : "bg-[var(--color-brand-bg)] text-[var(--color-brand-primary)]"
                }`}
                title={statusLabel}
              >
                {isEdited ? "✎" : "✓"}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
