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
    <div className="tree-children tree-children--indicators" role="group">
      {indicators.map((item) => {
        const isActive = item.review_item_id === activeReviewItemId;
        const isVisited = visitedItemIds?.has(item.review_item_id);
        const isKept = keptItemIds?.has(item.review_item_id);
        const isEdited = editedItemIds?.has(item.review_item_id);
        const statusLabel = isEdited ? "Edited issue" : isKept ? "Kept issue" : undefined;

        return (
          <button
            aria-current={isActive ? "true" : undefined}
            className={[
              "tree-row",
              "tree-row--indicator",
              isActive ? "tree-row--active" : "",
              isVisited ? "tree-row--visited" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            key={item.review_item_id}
            onClick={() => onActivateReviewItem(item.review_item_id)}
            type="button"
          >
            <strong title={item.indicator_name}>{item.indicator_id}</strong>
            {statusLabel ? (
              <span
                aria-label={statusLabel}
                className={isEdited ? "issue-status issue-status--edited" : "issue-status issue-status--kept"}
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
