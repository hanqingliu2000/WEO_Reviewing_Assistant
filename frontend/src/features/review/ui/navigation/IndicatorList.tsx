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
      className="ml-6 grid gap-0.5"
      role="group"
    >
      {indicators.map((item) => {
        const isActive = item.review_item_id === activeReviewItemId;
        const isVisited = visitedItemIds?.has(item.review_item_id);
        const isKept = keptItemIds?.has(item.review_item_id);
        const isEdited = editedItemIds?.has(item.review_item_id);
        const raisesIssue = Boolean(isKept || isEdited);
        const statusLabel = raisesIssue
          ? "Visited, issue will be raised"
          : isVisited
            ? "Visited, no issue raised"
            : "Not visited";

        return (
          <button
            aria-current={isActive ? "true" : undefined}
            className={`grid min-h-[28px] w-full grid-cols-[minmax(0,1fr)_18px] items-center gap-1.5 rounded-sm border bg-transparent px-2 py-1 text-left transition-colors hover:border-[var(--color-brand-primary)] focus-visible:outline-none focus-visible:shadow-[inset_0_0_0_1px_var(--color-brand-secondary)] ${
              isActive
                ? "border-[rgb(0_76_151_/_24%)] bg-[var(--color-brand-bg)] text-[var(--color-ink)] shadow-[inset_0_0_0_1px_rgb(0_76_151_/_12%)]"
                : "border-transparent text-[var(--color-ink)]"
            } ${isVisited ? "text-[var(--color-subtle)]" : ""}`}
            data-review-item-id={item.review_item_id}
            data-tree-row="true"
            key={item.review_item_id}
            onClick={() => onActivateReviewItem(item.review_item_id)}
            type="button"
          >
            <strong
              className="[overflow-wrap:anywhere] text-[11px] font-medium leading-[1.3] whitespace-normal"
              title={item.indicator_name}
            >
              {item.indicator_id}
            </strong>
            <span className="inline-grid h-[18px] w-[18px] place-items-center justify-self-end" title={statusLabel}>
              <span
                aria-label={statusLabel}
                className={`h-[9px] w-[9px] rounded-full ${
                  raisesIssue
                    ? "border border-[#b8860b] bg-[#f0c84b]"
                    : isVisited
                      ? "border border-[#248a4b] bg-[#35a862]"
                      : "border border-[var(--color-muted)] bg-transparent"
                }`}
              />
            </span>
          </button>
        );
      })}
    </div>
  );
}
