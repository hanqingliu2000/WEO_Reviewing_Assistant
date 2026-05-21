import type { NavigationSector } from "./navigationTree";
import { ValidationList } from "./ValidationList";

type SectorListProps = {
  activeReviewItemId: string;
  editedItemIds?: ReadonlySet<string>;
  expandedSectorIds: ReadonlySet<string>;
  expandedValidationIds: ReadonlySet<string>;
  keptItemIds?: ReadonlySet<string>;
  onActivateReviewItem: (reviewItemId: string) => void;
  onToggleSector: (sectorCode: string) => void;
  onToggleValidation: (validationNodeId: string) => void;
  sectors: NavigationSector[];
  visitedItemIds?: ReadonlySet<string>;
};

function sectorContainsActiveItem(sector: NavigationSector, activeReviewItemId: string) {
  return sector.validations.some((validation) =>
    validation.indicators.some((item) => item.review_item_id === activeReviewItemId),
  );
}

export function SectorList({
  activeReviewItemId,
  editedItemIds,
  expandedSectorIds,
  expandedValidationIds,
  keptItemIds,
  onActivateReviewItem,
  onToggleSector,
  onToggleValidation,
  sectors,
  visitedItemIds,
}: SectorListProps) {
  return (
    <>
      {sectors.map((sector) => {
        const isActive = sectorContainsActiveItem(sector, activeReviewItemId);
        const isExpanded = expandedSectorIds.has(sector.sectorCode);

        return (
          <div className="tree-group" key={sector.sectorCode}>
            <button
              aria-expanded={isExpanded}
              className={isActive ? "tree-row tree-row--sector tree-row--active" : "tree-row tree-row--sector"}
              onClick={() => onToggleSector(sector.sectorCode)}
              type="button"
            >
              <span className="tree-toggle" aria-hidden="true">
                {isExpanded ? "-" : "+"}
              </span>
              <span>{sector.sectorCode}</span>
              <strong>{sector.sectorName.replace(`${sector.sectorCode} - `, "")}</strong>
            </button>

            {isExpanded ? (
              <ValidationList
                activeReviewItemId={activeReviewItemId}
                editedItemIds={editedItemIds}
                expandedValidationIds={expandedValidationIds}
                keptItemIds={keptItemIds}
                onActivateReviewItem={onActivateReviewItem}
                onToggleValidation={onToggleValidation}
                validations={sector.validations}
                visitedItemIds={visitedItemIds}
              />
            ) : null}
          </div>
        );
      })}
    </>
  );
}
