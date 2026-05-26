import type { NavigationValidation } from "../../runtime/navigationTree";
import { DisclosureArrow } from "./DisclosureArrow";
import { IndicatorList } from "./IndicatorList";

type ValidationListProps = {
  activeReviewItemId: string;
  editedItemIds?: ReadonlySet<string>;
  expandedValidationIds: ReadonlySet<string>;
  keptItemIds?: ReadonlySet<string>;
  onActivateReviewItem: (reviewItemId: string) => void;
  onToggleValidation: (validationNodeId: string) => void;
  validations: NavigationValidation[];
  visitedItemIds?: ReadonlySet<string>;
};

export function ValidationList({
  activeReviewItemId,
  editedItemIds,
  expandedValidationIds,
  keptItemIds,
  onActivateReviewItem,
  onToggleValidation,
  validations,
  visitedItemIds,
}: ValidationListProps) {
  return (
    <div
      className="ml-3 grid gap-0.5"
      role="group"
    >
      {validations.map((validation) => {
        const isExpanded = expandedValidationIds.has(validation.nodeId);

        return (
          <div className="relative grid gap-0.5" key={validation.nodeId}>
            <button
              aria-expanded={isExpanded}
              className="grid min-h-[28px] w-full grid-cols-[16px_auto_minmax(0,1fr)] items-center gap-1.5 rounded-md border border-transparent bg-transparent px-2 py-1 text-left text-[var(--color-ink)] transition-colors hover:border-[var(--color-brand-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand-secondary)]"
              data-tree-row="true"
              onClick={() => onToggleValidation(validation.nodeId)}
              type="button"
            >
              <span
                className="inline-grid h-4 w-4 place-items-center text-[var(--color-muted)]"
                aria-hidden="true"
              >
                <DisclosureArrow expanded={isExpanded} />
              </span>
              <span
                className={`inline-grid min-h-[18px] place-items-center overflow-hidden rounded-full px-1.5 text-[10px] font-extrabold leading-none text-white ${
                  validation.severity === "Critical"
                    ? "bg-[#e46a6d]"
                    : validation.severity === "High"
                      ? "bg-[#f2a65a]"
                      : "bg-[#d8ba3a]"
                }`}
              >
                {validation.severity}
              </span>
              <strong className="[overflow-wrap:anywhere] text-[12px] font-semibold leading-[1.3] whitespace-normal">
                {validation.validationId}
              </strong>
            </button>

            {isExpanded ? (
              <IndicatorList
                activeReviewItemId={activeReviewItemId}
                editedItemIds={editedItemIds}
                indicators={validation.indicators}
                keptItemIds={keptItemIds}
                onActivateReviewItem={onActivateReviewItem}
                visitedItemIds={visitedItemIds}
              />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
