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

type ReportIdentity = "weo" | "mcdreo";

function ReportIdentitySwitch({
  onSelectedIdentityChange,
  selectedIdentity,
}: {
  onSelectedIdentityChange: (identity: ReportIdentity) => void;
  selectedIdentity: ReportIdentity;
}) {
  const optionClass = (identity: ReportIdentity) => {
    const isSelected = selectedIdentity === identity;

    if (identity === "weo") {
      return isSelected
        ? "border-[var(--color-brand-primary)] bg-[var(--color-brand-primary)] text-white shadow-[0_8px_16px_rgb(0_76_151_/_24%)]"
        : "border-[var(--color-brand-primary)] bg-transparent text-[var(--color-brand-primary)] hover:bg-[rgb(0_76_151_/_8%)]";
    }

    return isSelected
      ? "border-[#d8a10f] bg-[#d8a10f] text-white shadow-[0_8px_16px_rgb(216_161_15_/_26%)]"
      : "border-[#d8a10f] bg-transparent text-[#8a6100] hover:bg-[rgb(216_161_15_/_10%)]";
  };

  return (
    <div className="grid shrink-0 grid-cols-2 gap-1.5 border-b border-[var(--color-border)] bg-[var(--color-panel)] p-2" aria-label="Report identity switch">
      <button
        className={`grid min-h-[44px] place-items-center rounded-md border-2 px-2 text-[16px] font-black tracking-[0.04em] transition-all ${optionClass("weo")}`}
        onClick={() => onSelectedIdentityChange("weo")}
        type="button"
      >
        <span>WEO</span>
      </button>
      <button
        className={`grid min-h-[44px] place-items-center rounded-md border-2 px-2 text-[15px] font-black tracking-[0.02em] transition-all ${optionClass("mcdreo")}`}
        onClick={() => onSelectedIdentityChange("mcdreo")}
        type="button"
      >
        <span>MCD REO</span>
      </button>
    </div>
  );
}

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
  const [selectedIdentity, setSelectedIdentity] = useState<ReportIdentity>("weo");
  const pressedNavigationKeys = useRef(new Set<string>());

  useEffect(() => {
    setExpandedSectorIds(new Set(allSectorIds));
    setExpandedValidationIds(new Set(allValidationIds));
  }, [allSectorIds, allValidationIds]);

  const allCollapsed = expandedSectorIds.size === 0;
  const allExpanded = expandedSectorIds.size === allSectorIds.length && expandedValidationIds.size === allValidationIds.length;
  const navigationExerciseStyle =
    selectedIdentity === "weo"
      ? {
          backgroundColor: "rgb(0 76 151 / 0.035)",
          borderColor: "rgb(0 76 151 / 0.34)",
        }
      : {
          backgroundColor: "rgb(216 161 15 / 0.055)",
          borderColor: "rgb(216 161 15 / 0.4)",
        };

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
      <ReportIdentitySwitch
        onSelectedIdentityChange={setSelectedIdentity}
        selectedIdentity={selectedIdentity}
      />
      <div
        className="flex min-h-0 flex-1 flex-col overflow-hidden border-y transition-colors"
        style={navigationExerciseStyle}
        aria-label={`${selectedIdentity === "weo" ? "WEO" : "MCD REO"} navigation scope`}
      >
        <div
          aria-label="Review hierarchy"
          className="grid min-h-0 flex-1 auto-rows-max content-start gap-0.5 overflow-auto px-2 py-2 [overflow-anchor:none]"
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

        <div className="grid shrink-0 grid-cols-2 gap-2 border-t border-[inherit] bg-white/70 p-2" aria-label="Navigation tree controls">
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
    </div>
  );
}
