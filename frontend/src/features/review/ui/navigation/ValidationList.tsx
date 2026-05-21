import type { NavigationValidation } from "../../runtime/navigationTree";
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

function displayValidationName(validationName: string) {
  return validationName.replace(/^(Critical|High|Low)\s*-\s*/i, "");
}

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
      className="relative ml-[15px] grid gap-0.5 pl-3 before:absolute before:top-0 before:bottom-2 before:left-0 before:w-px before:bg-[var(--color-border)]"
      role="group"
    >
      {validations.map((validation) => {
        const isExpanded = expandedValidationIds.has(validation.nodeId);

        return (
          <div className="relative grid gap-0.5" key={validation.nodeId}>
            <button
              aria-expanded={isExpanded}
              className="grid min-h-[30px] w-full grid-cols-[22px_66px_minmax(0,1fr)] items-center gap-2 rounded-md border border-transparent bg-transparent p-1.5 pl-2 text-left text-[var(--color-ink)] transition-colors hover:border-[var(--color-brand-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand-secondary)]"
              data-tree-row="true"
              onClick={() => onToggleValidation(validation.nodeId)}
              type="button"
            >
              <span
                className="inline-grid h-[18px] w-[18px] place-items-center rounded-sm border border-[var(--color-border-strong)] bg-white text-xs leading-none text-[var(--color-muted)]"
                aria-hidden="true"
              >
                {isExpanded ? "-" : "+"}
              </span>
              <span
                className={`inline-grid min-h-[22px] min-w-[58px] place-items-center overflow-hidden rounded-full text-ellipsis text-[11px] font-extrabold text-white ${
                  validation.severity === "Critical"
                    ? "bg-[#e46a6d]"
                    : validation.severity === "High"
                      ? "bg-[#f2a65a]"
                      : "bg-[#d8ba3a]"
                }`}
              >
                {validation.severity}
              </span>
              <strong className="[overflow-wrap:anywhere] text-xs leading-[1.3] whitespace-normal">
                {displayValidationName(validation.validationName)}
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
