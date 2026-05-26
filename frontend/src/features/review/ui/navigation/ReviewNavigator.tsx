import type { KeyboardEvent, MutableRefObject } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
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

function restoreScrollPosition(container: HTMLDivElement, scrollTop: number) {
  container.scrollTop = scrollTop;
  requestAnimationFrame(() => {
    container.scrollTop = scrollTop;
    requestAnimationFrame(() => {
      container.scrollTop = scrollTop;
    });
  });
}

function focusTreeRow(row: HTMLButtonElement | undefined, container: HTMLDivElement) {
  if (!row) {
    return false;
  }

  const scrollTopBeforeFocus = container.scrollTop;
  const rowRectBeforeFocus = row.getBoundingClientRect();
  const containerRectBeforeFocus = container.getBoundingClientRect();
  const isVisibleBeforeFocus =
    rowRectBeforeFocus.top >= containerRectBeforeFocus.top && rowRectBeforeFocus.bottom <= containerRectBeforeFocus.bottom;

  row.focus({ preventScroll: true });
  container.scrollTop = scrollTopBeforeFocus;

  if (isVisibleBeforeFocus) {
    restoreScrollPosition(container, scrollTopBeforeFocus);
    return true;
  }

  const rowRect = row.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();

  if (rowRect.top < containerRect.top) {
    container.scrollTop -= containerRect.top - rowRect.top;
  } else if (rowRect.bottom > containerRect.bottom) {
    container.scrollTop += rowRect.bottom - containerRect.bottom;
  }

  return false;
}

function handleNavigationKeyDown(
  event: KeyboardEvent<HTMLDivElement>,
  onActiveReviewItemIdChange: (reviewItemId: string) => void,
  pressedNavigationKeys: MutableRefObject<Set<string>>,
) {
  if (event.key !== "ArrowDown" && event.key !== "ArrowUp") {
    return;
  }

  event.preventDefault();
  event.stopPropagation();

  if (event.repeat || pressedNavigationKeys.current.has(event.key)) {
    return;
  }
  pressedNavigationKeys.current.add(event.key);

  const rows = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>("[data-tree-row='true']"));
  const activeElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  const activeRow = activeElement?.closest<HTMLButtonElement>("[data-tree-row='true']");
  const currentIndex = rows.findIndex((row) => row === activeRow);
  const direction = event.key === "ArrowDown" ? 1 : -1;
  const indicatorRows = rows.filter((row) => row.dataset.reviewItemId);
  const nextRow =
    currentIndex === -1
      ? direction === 1
        ? indicatorRows[0]
        : indicatorRows[indicatorRows.length - 1]
      : direction === 1
        ? rows.slice(currentIndex + 1).find((row) => row.dataset.reviewItemId) ?? indicatorRows[indicatorRows.length - 1]
        : rows
            .slice(0, currentIndex)
            .reverse()
            .find((row) => row.dataset.reviewItemId) ?? indicatorRows[0];

  const shouldPreserveScroll = focusTreeRow(nextRow, event.currentTarget);

  const nextReviewItemId = nextRow?.dataset.reviewItemId;
  if (nextReviewItemId) {
    onActiveReviewItemIdChange(nextReviewItemId);
    if (shouldPreserveScroll) {
      restoreScrollPosition(event.currentTarget, event.currentTarget.scrollTop);
    }
  }
}

function handleNavigationKeyUp(
  event: KeyboardEvent<HTMLDivElement>,
  pressedNavigationKeys: MutableRefObject<Set<string>>,
) {
  if (event.key !== "ArrowDown" && event.key !== "ArrowUp") {
    return;
  }

  event.preventDefault();
  event.stopPropagation();
  pressedNavigationKeys.current.delete(event.key);
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
  const pressedNavigationKeys = useRef(new Set<string>());

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
        className="grid min-h-0 flex-1 auto-rows-max content-start gap-0.5 overflow-auto px-2 pb-2 [overflow-anchor:none]"
        onBlur={(event) => {
          const nextFocusedElement = event.relatedTarget instanceof Node ? event.relatedTarget : null;
          if (!nextFocusedElement || !event.currentTarget.contains(nextFocusedElement)) {
            pressedNavigationKeys.current.clear();
          }
        }}
        onKeyDownCapture={(event) => handleNavigationKeyDown(event, onActiveReviewItemIdChange, pressedNavigationKeys)}
        onKeyUpCapture={(event) => handleNavigationKeyUp(event, pressedNavigationKeys)}
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
