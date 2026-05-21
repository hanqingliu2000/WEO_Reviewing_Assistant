import type { NavigationValidation } from "./navigationTree";
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
    <div className="tree-children" role="group">
      {validations.map((validation) => {
        const isExpanded = expandedValidationIds.has(validation.nodeId);

        return (
          <div className="tree-group tree-group--validation" key={validation.nodeId}>
            <button
              aria-expanded={isExpanded}
              className="tree-row tree-row--validation"
              onClick={() => onToggleValidation(validation.nodeId)}
              type="button"
            >
              <span className="tree-toggle" aria-hidden="true">
                {isExpanded ? "-" : "+"}
              </span>
              <span className={`severity-dot severity-dot--${validation.severity.toLowerCase()}`}>
                {validation.severity}
              </span>
              <strong>{displayValidationName(validation.validationName)}</strong>
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
