import type { KeyboardEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import type { ReviewItem } from "../../types/review";
import { buildNavigationTree } from "../../runtime/navigationTree";
import { SectorList } from "./SectorList";

type ReviewNavigatorProps = {
  activeReviewItemId: string;
  editedItemIds?: ReadonlySet<string>;
  hasQuarterlyData: boolean;
  keptItemIds?: ReadonlySet<string>;
  onActiveReviewItemIdChange: (reviewItemId: string) => void;
  reviewItems: ReviewItem[];
  visitedItemIds?: ReadonlySet<string>;
};

function handleNavigationKeyDown(event: KeyboardEvent<HTMLDivElement>) {
  if (event.key !== "ArrowDown" && event.key !== "ArrowUp") {
    return;
  }

  event.preventDefault();
  const rows = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>("[data-tree-row='true']"));
  const currentIndex = rows.findIndex((row) => row === document.activeElement);

  if (currentIndex === -1) {
    rows[0]?.focus();
    return;
  }

  const direction = event.key === "ArrowDown" ? 1 : -1;
  const nextIndex = Math.min(Math.max(currentIndex + direction, 0), rows.length - 1);
  rows[nextIndex]?.focus();
}

export function ReviewNavigator({
  activeReviewItemId,
  editedItemIds,
  hasQuarterlyData,
  keptItemIds,
  onActiveReviewItemIdChange,
  reviewItems,
  visitedItemIds,
}: ReviewNavigatorProps) {
  const navigationTree = useMemo(() => buildNavigationTree(reviewItems, hasQuarterlyData), [hasQuarterlyData, reviewItems]);
  const allSectorIds = useMemo(() => navigationTree.map((sector) => sector.sectorCode), [navigationTree]);
  const allValidationIds = useMemo(
    () => navigationTree.flatMap((sector) => sector.validations.map((validation) => validation.nodeId)),
    [navigationTree],
  );
  const [expandedSectorIds, setExpandedSectorIds] = useState<Set<string>>(() => new Set(allSectorIds));
  const [expandedValidationIds, setExpandedValidationIds] = useState<Set<string>>(() => new Set(allValidationIds));

  useEffect(() => {
    setExpandedSectorIds(new Set(allSectorIds));
    setExpandedValidationIds(new Set(allValidationIds));
  }, [allSectorIds, allValidationIds]);

  const allCollapsed = expandedSectorIds.size === 0;
  const allExpanded = expandedSectorIds.size === allSectorIds.length && expandedValidationIds.size === allValidationIds.length;

  function toggleSector(sectorCode: string) {
    setExpandedSectorIds((current) => {
      const next = new Set(current);
      if (next.has(sectorCode)) {
        next.delete(sectorCode);
      } else {
        next.add(sectorCode);
      }
      return next;
    });
  }

  function toggleValidation(validationNodeId: string) {
    setExpandedValidationIds((current) => {
      const next = new Set(current);
      if (next.has(validationNodeId)) {
        next.delete(validationNodeId);
      } else {
        next.add(validationNodeId);
      }
      return next;
    });
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-0">
      <div
        aria-label="Review hierarchy"
        className="grid min-h-0 flex-1 auto-rows-max content-start gap-0.5 overflow-auto px-2 pb-2"
        onKeyDown={handleNavigationKeyDown}
        role="tree"
      >
        <SectorList
          activeReviewItemId={activeReviewItemId}
          editedItemIds={editedItemIds}
          expandedSectorIds={expandedSectorIds}
          expandedValidationIds={expandedValidationIds}
          keptItemIds={keptItemIds}
          onActivateReviewItem={onActiveReviewItemIdChange}
          onToggleSector={toggleSector}
          onToggleValidation={toggleValidation}
          sectors={navigationTree}
          visitedItemIds={visitedItemIds}
        />
      </div>

      <div className="grid shrink-0 grid-cols-2 gap-2 border-t border-[var(--color-border)] bg-[var(--color-panel)] p-2" aria-label="Navigation tree controls">
        <button
          className="min-h-[30px] rounded-md border border-[var(--color-border-strong)] bg-white text-xs font-bold text-[var(--color-ink)] enabled:hover:border-[var(--color-brand-primary)] enabled:hover:text-[var(--color-brand-primary)] disabled:cursor-default disabled:opacity-[0.45]"
          disabled={allCollapsed}
          onClick={() => {
            setExpandedSectorIds(new Set());
          }}
          type="button"
        >
          Collapse all
        </button>
        <button
          className="min-h-[30px] rounded-md border border-[var(--color-border-strong)] bg-white text-xs font-bold text-[var(--color-ink)] enabled:hover:border-[var(--color-brand-primary)] enabled:hover:text-[var(--color-brand-primary)] disabled:cursor-default disabled:opacity-[0.45]"
          disabled={allExpanded}
          onClick={() => {
            setExpandedSectorIds(new Set(allSectorIds));
            setExpandedValidationIds(new Set(allValidationIds));
          }}
          type="button"
        >
          Expand all
        </button>
      </div>
    </div>
  );
}
