import type { NavigationSector } from "../../runtime/navigationTree";
import { DisclosureArrow } from "./DisclosureArrow";
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
          <div className="relative grid gap-0.5" key={sector.sectorCode}>
            <button
              aria-expanded={isExpanded}
              className={`grid min-h-[34px] w-full grid-cols-[16px_28px_minmax(0,1fr)] items-center gap-1.5 rounded-md border px-2 py-1.5 text-left text-[var(--color-ink)] transition-colors hover:border-[var(--color-brand-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand-secondary)] ${
                isActive
                  ? "border-[rgb(0_76_151_/_20%)] bg-[var(--color-brand-bg)]"
                  : "border-transparent bg-[#eef3f8]"
              }`}
              data-tree-row="true"
              onClick={() => onToggleSector(sector.sectorCode)}
              type="button"
            >
              <span
                className="inline-grid h-4 w-4 place-items-center text-[var(--color-brand-primary)]"
                aria-hidden="true"
              >
                <DisclosureArrow expanded={isExpanded} />
              </span>
              <span className="text-[11px] font-extrabold text-[var(--color-brand-primary)]">{sector.sectorCode}</span>
              <strong className="[overflow-wrap:anywhere] text-[13px] font-extrabold leading-[1.3] whitespace-normal">
                {sector.sectorName.replace(`${sector.sectorCode} - `, "")}
              </strong>
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
