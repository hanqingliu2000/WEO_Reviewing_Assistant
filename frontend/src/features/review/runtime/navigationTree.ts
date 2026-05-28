import type { ReviewItem } from "../types/review";

const SEVERITY_ORDER: Record<ReviewItem["severity"], number> = {
  Critical: 0,
  High: 1,
  Low: 2,
};

export type NavigationValidation = {
  nodeId: string;
  validationId: string;
  validationName: string;
  severity: ReviewItem["severity"];
  indicators: ReviewItem[];
};

export type NavigationSector = {
  sectorCode: string;
  sectorName: string;
  validations: NavigationValidation[];
};

export function buildNavigationTree(items: ReviewItem[], hasQuarterlyData: boolean): NavigationSector[] {
  const sectors = new Map<string, NavigationSector>();

  items
    .filter((item) => hasQuarterlyData || item.frequency !== "Q")
    .forEach((item) => {
      let sector = sectors.get(item.sector_code);
      if (!sector) {
        sector = {
          sectorCode: item.sector_code,
          sectorName: item.sector_name,
          validations: [],
        };
        sectors.set(item.sector_code, sector);
      }

      let validation = sector.validations.find((entry) => entry.validationId === item.validation_id);
      if (!validation) {
        validation = {
          nodeId: `${item.sector_code}:${item.validation_id}`,
          validationId: item.validation_id,
          validationName: item.validation_name,
          severity: item.severity,
          indicators: [],
        };
        sector.validations.push(validation);
      }

      validation.indicators.push(item);
    });

  return Array.from(sectors.values()).map((sector) => ({
    ...sector,
    validations: [...sector.validations].sort((first, second) => {
      const severityDelta = SEVERITY_ORDER[first.severity] - SEVERITY_ORDER[second.severity];

      if (severityDelta !== 0) {
        return severityDelta;
      }

      return first.validationId.localeCompare(second.validationId);
    }),
  }));
}

export function getFirstReviewItemId(sector: NavigationSector) {
  return sector.validations[0]?.indicators[0]?.review_item_id;
}
