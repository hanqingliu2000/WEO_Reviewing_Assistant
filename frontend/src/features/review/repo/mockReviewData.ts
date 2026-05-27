import type {
  DraftSnippet,
  EvidenceSelection,
  Frequency,
  IndicatorSeriesSet,
  IssueReportEntry,
  RelatedIndicatorSeries,
  ReviewItem,
  ReviewItemDetail,
  ReviewSession,
  Severity,
  TimeSeries,
  TimeSeriesPoint,
} from "../types/review";

const COUNTRY = {
  numeric_code: "901",
  iso_code: "XFA",
  name: "Fictional Economy A",
};

const ANNUAL_PERIODS = Array.from({ length: 2031 - 1980 + 1 }, (_, index) => String(1980 + index));

const QUARTERLY_PERIODS = Array.from({ length: (2027 - 1990 + 1) * 4 }, (_, index) => {
  const year = 1990 + Math.floor(index / 4);
  const quarter = (index % 4) + 1;

  return `${year}Q${quarter}`;
});

const SECTORS = {
  real: { code: "01", name: "01 - National Accounts - Real" },
  nominal: { code: "02", name: "02 - National Accounts - Nominal" },
  price: { code: "03", name: "03 - Price, Labor, Monetary" },
  fiscal: { code: "04", name: "04 - Fiscal" },
  trade: { code: "05", name: "05 - Trade" },
  bop: { code: "06", name: "06 - BOP" },
  qna: { code: "09", name: "09 - Q-National Accounts" },
  qprice: { code: "10", name: "10 - Q-Price, Labor" },
};

type IndicatorConfig = {
  indicator_id: string;
  indicator_name: string;
  frequency: Frequency;
  descriptor: string;
  base: number;
  step: number;
  previous_offset: number;
  published_offset?: number;
  formula?: string;
  desk_series?: string;
};

const INDICATORS: Record<string, IndicatorConfig> = {
  NGDP_R: {
    indicator_id: "NGDP_R",
    indicator_name: "Real output volume index",
    frequency: "A",
    descriptor: "Synthetic real activity indicator, index level",
    base: 92,
    step: 2.4,
    previous_offset: -1.6,
    published_offset: -2.1,
    formula: "Aggregate real output / base-year aggregate real output * 100",
  },
  NGDP: {
    indicator_id: "NGDP",
    indicator_name: "Nominal output value",
    frequency: "A",
    descriptor: "Synthetic nominal aggregate, local units",
    base: 420,
    step: 22,
    previous_offset: -14,
    published_offset: -18,
    desk_series: "mock_nominal_output_value",
  },
  PCPI_IX: {
    indicator_id: "PCPI_IX",
    indicator_name: "Consumer price index",
    frequency: "A",
    descriptor: "Synthetic consumer price index",
    base: 101,
    step: 3.1,
    previous_offset: -0.8,
    published_offset: -1.2,
    desk_series: "mock_cpi_index",
  },
  LUR: {
    indicator_id: "LUR",
    indicator_name: "Labor slack rate",
    frequency: "A",
    descriptor: "Synthetic labor market rate",
    base: 7.6,
    step: -0.15,
    previous_offset: 0.25,
    desk_series: "mock_labor_slack_rate",
  },
  GGR_NGDP: {
    indicator_id: "GGR_NGDP",
    indicator_name: "General revenue ratio",
    frequency: "A",
    descriptor: "Synthetic government revenue as a ratio",
    base: 23.4,
    step: 0.2,
    previous_offset: -0.4,
    formula: "General revenue / nominal output * 100",
  },
  GGX_NGDP: {
    indicator_id: "GGX_NGDP",
    indicator_name: "General expenditure ratio",
    frequency: "A",
    descriptor: "Synthetic government expenditure as a ratio",
    base: 27.8,
    step: 0.1,
    previous_offset: 0.5,
    desk_series: "mock_expenditure_ratio",
  },
  BX_GDP: {
    indicator_id: "BX_GDP",
    indicator_name: "External sales value",
    frequency: "A",
    descriptor: "Synthetic export-like flow",
    base: 145,
    step: 6.4,
    previous_offset: -4.2,
    published_offset: -3.4,
    desk_series: "mock_external_sales_value",
  },
  BM_GDP: {
    indicator_id: "BM_GDP",
    indicator_name: "External purchases value",
    frequency: "A",
    descriptor: "Synthetic import-like flow",
    base: 168,
    step: 5.8,
    previous_offset: 3.5,
    desk_series: "mock_external_purchases_value",
  },
  Q_NGDP_R_SA: {
    indicator_id: "Q_NGDP_R_SA",
    indicator_name: "Quarterly real activity index",
    frequency: "Q",
    descriptor: "Synthetic quarterly real activity indicator",
    base: 98,
    step: 0.9,
    previous_offset: -0.7,
    formula: "Quarterly activity / quarterly base activity * 100",
  },
  Q_PCPI_IX: {
    indicator_id: "Q_PCPI_IX",
    indicator_name: "Quarterly price index",
    frequency: "Q",
    descriptor: "Synthetic quarterly price index",
    base: 104,
    step: 0.8,
    previous_offset: -0.4,
    published_offset: -0.6,
    desk_series: "mock_quarterly_price_index",
  },
};

const EXTRA_INDICATOR_ROWS: Array<readonly [string, string, Frequency, number, number, number, number?]> = [
  ["NGDP_RPCH", "Real GDP growth", "A", 3.2, 0.1, -0.6, -0.8],
  ["NFI_R", "Real net factor income", "A", 11.8, 0.4, -0.9],
  ["NID_NGDP", "National investment ratio", "A", 21.4, 0.2, -0.5],
  ["NGS_NGDP", "Gross national savings ratio", "A", 24.7, 0.1, -0.7],
  ["PCPIEPCH", "End-period inflation", "A", 4.1, 0.2, -0.5],
  ["LP", "Population", "A", 32.5, 0.3, -0.1],
  ["LE", "Employment", "A", 15.2, 0.2, -0.3],
  ["GGXCNL_NGDP", "General government net lending", "A", -3.1, 0.1, -0.4],
  ["GGXWDN_NGDP", "General government gross debt", "A", 61.5, 1.1, 1.6],
  ["BCA_NGDPD", "Current account balance", "A", -2.6, 0.1, -0.4],
  ["BF_NGDPD", "Financial account balance", "A", 1.8, 0.1, 0.5],
  ["Q_NGDP_RPCH", "Quarterly real GDP growth", "Q", 1.1, 0.1, -0.3],
  ["Q_NID_NGDP", "Quarterly investment ratio", "Q", 22.3, 0.1, -0.4],
  ["Q_PCPIEPCH", "Quarterly end-period inflation", "Q", 1.4, 0.1, -0.2],
  ["Q_LUR", "Quarterly unemployment rate", "Q", 7.1, -0.05, 0.2],
  ["PPPSH", "World GDP share", "A", 0.42, 0.01, -0.03],
  ["NGAP_NPGDP", "Output gap", "A", -0.8, 0.2, -0.5],
  ["NFI_RPCH", "Real net factor income growth", "A", 2.4, 0.1, -0.8],
  ["NCP_R", "Real private consumption", "A", 82, 1.7, -1.0],
  ["NCG_R", "Real public consumption", "A", 35, 0.8, -0.7],
  ["NFI_NGDP", "Net factor income ratio", "A", 3.2, 0.1, -0.4],
  ["PCPI_PC_CP_A_PT", "Average CPI contribution", "A", 2.6, 0.2, -0.4],
  ["GGXONLB_NGDP", "Structural balance", "A", -2.2, 0.1, -0.3],
  ["GGXWDG_NGDP", "General government net debt", "A", 48.2, 0.9, 1.2],
  ["BFD_NGDPD", "Direct investment balance", "A", 2.1, 0.1, -0.3],
  ["BFO_NGDPD", "Other investment balance", "A", -1.4, 0.2, 0.5],
  ["Q_NCP_R", "Quarterly real private consumption", "Q", 88, 0.6, -0.5],
  ["Q_NCG_R", "Quarterly real public consumption", "Q", 38, 0.3, -0.3],
  ["Q_PCPI_PC_CP_A_PT", "Quarterly CPI contribution", "Q", 0.7, 0.05, -0.1],
];

const EXTRA_INDICATORS: IndicatorConfig[] = EXTRA_INDICATOR_ROWS.map(
  ([indicator_id, indicator_name, frequency, base, step, previous_offset, published_offset]) => ({
    indicator_id,
    indicator_name,
    frequency,
    descriptor: `Mock ${indicator_name.toLowerCase()} series`,
    base,
    step,
    previous_offset,
    published_offset,
    desk_series: `mock_${indicator_id.toLowerCase()}`,
  }),
);

Object.assign(
  INDICATORS,
  Object.fromEntries(EXTRA_INDICATORS.map((indicator) => [indicator.indicator_id, indicator])),
);

function periodsFor(frequency: Frequency): string[] {
  return frequency === "Q" ? QUARTERLY_PERIODS : ANNUAL_PERIODS;
}

function makePoints(
  periods: string[],
  indicator: IndicatorConfig,
  offset = 0,
  nullPeriods: string[] = [],
): TimeSeriesPoint[] {
  return periods.map((period, index) => {
    const wave = Math.sin(index / 2) * Math.max(Math.abs(indicator.step) * 0.35, 0.25);
    const value = nullPeriods.includes(period)
      ? null
      : Number((indicator.base + indicator.step * index + offset + wave).toFixed(1));

    return { period, value };
  });
}

function makeTimeSeries(
  indicator: IndicatorConfig,
  version: "current" | "previous" | "published",
  offset = 0,
  nullPeriods: string[] = [],
): TimeSeries {
  return {
    series_id: `${indicator.indicator_id}_${version}`,
    indicator_id: indicator.indicator_id,
    indicator_name: indicator.indicator_name,
    frequency: indicator.frequency,
    points: makePoints(periodsFor(indicator.frequency), indicator, offset, nullPeriods),
  };
}

function makeIndicatorSeriesSet(
  indicator: IndicatorConfig,
  options: {
    null_periods?: string[];
    omit_published?: boolean;
  } = {},
): IndicatorSeriesSet {
  return {
    indicator_id: indicator.indicator_id,
    indicator_name: indicator.indicator_name,
    descriptor: indicator.descriptor,
    formula: indicator.formula,
    desk_series: indicator.desk_series,
    current: makeTimeSeries(indicator, "current", 0, options.null_periods),
    previous: makeTimeSeries(indicator, "previous", indicator.previous_offset, options.null_periods),
    published:
      !options.omit_published && indicator.published_offset !== undefined
        ? makeTimeSeries(indicator, "published", indicator.published_offset)
        : undefined,
  };
}

export const mockIndicatorSeriesSets: Record<string, IndicatorSeriesSet> = Object.fromEntries(
  Object.values(INDICATORS).map((indicator) => [
    indicator.indicator_id,
    makeIndicatorSeriesSet(indicator, {
      null_periods: indicator.indicator_id === "GGX_NGDP" ? ["2022"] : [],
    }),
  ]),
);

function makeRelatedIndicator(
  reportIndicator: IndicatorConfig,
  suffix: string,
  nameSuffix: string,
  scale: number,
): RelatedIndicatorSeries {
  const relatedConfig: IndicatorConfig = {
    ...reportIndicator,
    indicator_id: `${reportIndicator.indicator_id}_${suffix}`,
    indicator_name: `${reportIndicator.indicator_name} - ${nameSuffix}`,
    base: reportIndicator.base * scale,
    step: reportIndicator.step * scale,
    previous_offset: reportIndicator.previous_offset * scale,
    published_offset:
      reportIndicator.published_offset === undefined ? undefined : reportIndicator.published_offset * scale,
    formula: undefined,
    desk_series: `mock_related_${reportIndicator.indicator_id.toLowerCase()}_${suffix.toLowerCase()}`,
  };

  return makeIndicatorSeriesSet(relatedConfig);
}

export const mockRelatedIndicatorSeries: Record<string, RelatedIndicatorSeries[]> = Object.fromEntries(
  Object.values(INDICATORS).map((indicator) => [
    indicator.indicator_id,
    [
      makeRelatedIndicator(indicator, "R1", "related level", 0.8),
      makeRelatedIndicator(indicator, "R2", "related ratio", 0.12),
    ],
  ]),
);

function reviewItem(params: {
  id: string;
  sector: { code: string; name: string };
  severity: Severity;
  validation_id: string;
  validation_name: string;
  indicator: IndicatorConfig;
  flagged_periods: string[];
  has_published?: boolean;
  has_related_indicators?: boolean;
}): ReviewItem {
  return {
    review_item_id: params.id,
    country_numeric_code: COUNTRY.numeric_code,
    country_iso_code: COUNTRY.iso_code,
    sector_code: params.sector.code,
    sector_name: params.sector.name,
    severity: params.severity,
    validation_id: params.validation_id,
    validation_name: params.validation_name,
    indicator_id: params.indicator.indicator_id,
    indicator_name: params.indicator.indicator_name,
    frequency: params.indicator.frequency,
    flagged_periods: params.flagged_periods,
    flagged_data_point_count: params.flagged_periods.length,
    has_published: params.has_published ?? Boolean(params.indicator.published_offset),
    has_related_indicators: params.has_related_indicators ?? true,
  };
}

const additionalReviewItemSeeds: Array<{
  sector: { code: string; name: string };
  severity: Severity;
  validation_id: string;
  validation_name: string;
  indicator_ids: string[];
  flagged_periods: string[];
  has_published?: boolean;
  has_related_indicators?: boolean;
}> = [
  {
    sector: SECTORS.real,
    severity: "Critical",
    validation_id: "CRIT_REVISION_SPIKE",
    validation_name: "Critical - Large revision in recent periods",
    indicator_ids: [
      "NGDP_RPCH",
      "NFI_R",
      "NID_NGDP",
      "NGS_NGDP",
      "PPPSH",
      "NGAP_NPGDP",
      "NFI_RPCH",
      "NCP_R",
      "NCG_R",
      "NFI_NGDP",
      "PCPI_IX",
      "PCPIEPCH",
      "LP",
      "LE",
      "LUR",
      "GGR_NGDP",
    ],
    flagged_periods: ["2025", "2026"],
  },
  {
    sector: SECTORS.real,
    severity: "High",
    validation_id: "HIGH_LEVEL_BREAK",
    validation_name: "High - Level break against previous submission",
    indicator_ids: ["NCP_R", "NCG_R", "NGAP_NPGDP"],
    flagged_periods: ["2024"],
  },
  {
    sector: SECTORS.nominal,
    severity: "High",
    validation_id: "HIGH_NOMINAL_REAL_GAP",
    validation_name: "High - Nominal and real movement diverge",
    indicator_ids: ["NGDP_R", "NGDP_RPCH", "PPPSH"],
    flagged_periods: ["2026", "2027"],
  },
  {
    sector: SECTORS.price,
    severity: "Critical",
    validation_id: "CRIT_PRICE_ACCELERATION",
    validation_name: "Critical - Price path acceleration",
    indicator_ids: ["PCPIEPCH", "PCPI_PC_CP_A_PT"],
    flagged_periods: ["2024", "2025", "2026"],
  },
  {
    sector: SECTORS.price,
    severity: "Low",
    validation_id: "LOW_LABOR_GAP",
    validation_name: "Low - Labor rate differs from expected path",
    indicator_ids: ["LP", "LE"],
    flagged_periods: ["2027"],
    has_published: false,
    has_related_indicators: false,
  },
  {
    sector: SECTORS.fiscal,
    severity: "High",
    validation_id: "HIGH_RATIO_SHIFT",
    validation_name: "High - Fiscal ratio changed materially",
    indicator_ids: ["GGX_NGDP", "GGXCNL_NGDP", "GGXWDN_NGDP"],
    flagged_periods: ["2025", "2026"],
  },
  {
    sector: SECTORS.fiscal,
    severity: "Low",
    validation_id: "LOW_SMOOTHING_CHECK",
    validation_name: "Low - Smoothness check flagged out-year movement",
    indicator_ids: ["GGXONLB_NGDP", "GGXWDG_NGDP", "GGXCNL_NGDP"],
    flagged_periods: ["2028"],
    has_published: false,
  },
  {
    sector: SECTORS.trade,
    severity: "High",
    validation_id: "HIGH_FLOW_REVISION",
    validation_name: "High - External flow revision exceeds threshold",
    indicator_ids: ["BM_GDP", "BCA_NGDPD"],
    flagged_periods: ["2024", "2025"],
  },
  {
    sector: SECTORS.trade,
    severity: "Critical",
    validation_id: "CRIT_BALANCE_INCONSISTENCY",
    validation_name: "Critical - Flow consistency check failed",
    indicator_ids: ["BCA_NGDPD", "BF_NGDPD"],
    flagged_periods: ["2025"],
    has_published: false,
  },
  {
    sector: SECTORS.bop,
    severity: "Low",
    validation_id: "LOW_METADATA_REVIEW",
    validation_name: "Low - Metadata review recommended",
    indicator_ids: ["BF_NGDPD", "BFD_NGDPD", "BFO_NGDPD"],
    flagged_periods: ["2027"],
  },
  {
    sector: SECTORS.qna,
    severity: "High",
    validation_id: "HIGH_Q_REVISION",
    validation_name: "High - Quarterly revision concentrated in latest quarters",
    indicator_ids: ["Q_NGDP_RPCH", "Q_NID_NGDP", "Q_NCP_R", "Q_NCG_R"],
    flagged_periods: ["2025Q3", "2025Q4", "2026Q1"],
    has_published: false,
  },
  {
    sector: SECTORS.qprice,
    severity: "Critical",
    validation_id: "CRIT_Q_PRICE_JUMP",
    validation_name: "Critical - Quarterly price index jump",
    indicator_ids: ["Q_PCPIEPCH", "Q_LUR", "Q_PCPI_PC_CP_A_PT"],
    flagged_periods: ["2025Q2", "2025Q3"],
  },
];

let nextAdditionalReviewItemNumber = 13;

export const mockReviewItems: ReviewItem[] = [
  reviewItem({
    id: "ri-001",
    sector: SECTORS.real,
    severity: "Critical",
    validation_id: "CRIT_REVISION_SPIKE",
    validation_name: "Critical - Large revision in recent periods",
    indicator: INDICATORS.NGDP_R,
    flagged_periods: ["2025", "2026"],
  }),
  reviewItem({
    id: "ri-002",
    sector: SECTORS.real,
    severity: "High",
    validation_id: "HIGH_LEVEL_BREAK",
    validation_name: "High - Level break against previous submission",
    indicator: INDICATORS.NGDP_R,
    flagged_periods: ["2024"],
  }),
  reviewItem({
    id: "ri-003",
    sector: SECTORS.nominal,
    severity: "High",
    validation_id: "HIGH_NOMINAL_REAL_GAP",
    validation_name: "High - Nominal and real movement diverge",
    indicator: INDICATORS.NGDP,
    flagged_periods: ["2026", "2027"],
  }),
  reviewItem({
    id: "ri-004",
    sector: SECTORS.price,
    severity: "Critical",
    validation_id: "CRIT_PRICE_ACCELERATION",
    validation_name: "Critical - Price path acceleration",
    indicator: INDICATORS.PCPI_IX,
    flagged_periods: ["2024", "2025", "2026"],
  }),
  reviewItem({
    id: "ri-005",
    sector: SECTORS.price,
    severity: "Low",
    validation_id: "LOW_LABOR_GAP",
    validation_name: "Low - Labor rate differs from expected path",
    indicator: INDICATORS.LUR,
    flagged_periods: ["2027"],
    has_published: false,
    has_related_indicators: false,
  }),
  reviewItem({
    id: "ri-006",
    sector: SECTORS.fiscal,
    severity: "High",
    validation_id: "HIGH_RATIO_SHIFT",
    validation_name: "High - Fiscal ratio changed materially",
    indicator: INDICATORS.GGR_NGDP,
    flagged_periods: ["2025", "2026"],
  }),
  reviewItem({
    id: "ri-007",
    sector: SECTORS.fiscal,
    severity: "Low",
    validation_id: "LOW_SMOOTHING_CHECK",
    validation_name: "Low - Smoothness check flagged out-year movement",
    indicator: INDICATORS.GGX_NGDP,
    flagged_periods: ["2028"],
    has_published: false,
  }),
  reviewItem({
    id: "ri-008",
    sector: SECTORS.trade,
    severity: "High",
    validation_id: "HIGH_FLOW_REVISION",
    validation_name: "High - External flow revision exceeds threshold",
    indicator: INDICATORS.BX_GDP,
    flagged_periods: ["2024", "2025"],
  }),
  reviewItem({
    id: "ri-009",
    sector: SECTORS.trade,
    severity: "Critical",
    validation_id: "CRIT_BALANCE_INCONSISTENCY",
    validation_name: "Critical - Flow consistency check failed",
    indicator: INDICATORS.BM_GDP,
    flagged_periods: ["2025"],
    has_published: false,
  }),
  reviewItem({
    id: "ri-010",
    sector: SECTORS.bop,
    severity: "Low",
    validation_id: "LOW_METADATA_REVIEW",
    validation_name: "Low - Metadata review recommended",
    indicator: INDICATORS.BX_GDP,
    flagged_periods: ["2027"],
  }),
  reviewItem({
    id: "ri-011",
    sector: SECTORS.qna,
    severity: "High",
    validation_id: "HIGH_Q_REVISION",
    validation_name: "High - Quarterly revision concentrated in latest quarters",
    indicator: INDICATORS.Q_NGDP_R_SA,
    flagged_periods: ["2025Q3", "2025Q4", "2026Q1"],
    has_published: false,
  }),
  reviewItem({
    id: "ri-012",
    sector: SECTORS.qprice,
    severity: "Critical",
    validation_id: "CRIT_Q_PRICE_JUMP",
    validation_name: "Critical - Quarterly price index jump",
    indicator: INDICATORS.Q_PCPI_IX,
    flagged_periods: ["2025Q2", "2025Q3"],
  }),
  ...additionalReviewItemSeeds.flatMap((seed) =>
    seed.indicator_ids.map((indicatorId) => {
      const reviewItemNumber = nextAdditionalReviewItemNumber;
      nextAdditionalReviewItemNumber += 1;

      return reviewItem({
        id: `ri-${String(reviewItemNumber).padStart(3, "0")}`,
        sector: seed.sector,
        severity: seed.severity,
        validation_id: seed.validation_id,
        validation_name: seed.validation_name,
        indicator: INDICATORS[indicatorId],
        flagged_periods: seed.flagged_periods,
        has_published: seed.has_published,
        has_related_indicators: seed.has_related_indicators,
      });
    }),
  ),
];

export const mockReviewSession: ReviewSession = {
  session_id: "mock-session-2026-05",
  country: COUNTRY,
  submission: {
    submission_id: "mock-submission-alpha",
    submission_timestamp: "2026-05-20T09:00:00",
    status_label: "Mock submission loaded",
    reviewer: "Demo Reviewer",
    submitted_by: "Demo Country Team",
  },
  has_quarterly_data: mockReviewItems.some((item) => item.frequency === "Q"),
  review_item_ids: mockReviewItems.map((item) => item.review_item_id),
};

export const mockEmptyReviewSession: ReviewSession = {
  session_id: "mock-empty-session",
  country: {
    numeric_code: "902",
    iso_code: "XFB",
    name: "Fictional Economy B",
  },
  submission: {
    submission_id: "mock-submission-empty",
    submission_timestamp: "2026-05-20T10:00:00",
    status_label: "Mock no-flag submission",
    reviewer: "Demo Reviewer",
    submitted_by: "Demo Country Team",
  },
  has_quarterly_data: false,
  review_item_ids: [],
};

type MockIssueReportSourceEntry = IssueReportEntry & {
  validation_id: string;
  indicator_id: string;
};

const issueReportEntries: MockIssueReportSourceEntry[] = [
  {
    issue_report_entry_id: "issue-history-001",
    validation_id: "CRIT_REVISION_SPIKE",
    indicator_id: "NGDP_R",
    period_range: "2023-2024",
    explanation:
      "Previous mock review noted a methodology update in the recent history. The explanation was accepted for that cycle, but reviewers asked that future out-year changes be documented separately.",
  },
  {
    issue_report_entry_id: "issue-history-002",
    validation_id: "CRIT_REVISION_SPIKE",
    indicator_id: "NGDP_R",
    period_range: "2025",
    explanation:
      "Mock confirmation stated that the new path reflected a revised source assumption rather than a data entry issue.",
  },
  {
    issue_report_entry_id: "issue-history-003",
    validation_id: "HIGH_RATIO_SHIFT",
    indicator_id: "GGR_NGDP",
    period_range: "2024-2026",
    explanation:
      "The ratio change was previously described as a classification update. This longer mock text is intentionally two to three lines in a compact layout so the UI can test clamp, expand, and popover behavior without relying on real review language.",
  },
  {
    issue_report_entry_id: "issue-history-004",
    validation_id: "CRIT_Q_PRICE_JUMP",
    indicator_id: "Q_PCPI_IX",
    period_range: "2025Q2-2025Q3",
    explanation:
      "Quarterly mock explanation: short-lived index movement was previously attributed to a synthetic timing shift.",
  },
];

export const mockReviewItemDetails: Record<string, ReviewItemDetail> = Object.fromEntries(
  mockReviewItems.map((item) => {
    const mainSeries = mockIndicatorSeriesSets[item.indicator_id];
    const history = issueReportEntries
      .filter((entry) => entry.validation_id === item.validation_id && entry.indicator_id === item.indicator_id)
      .map(({ validation_id: _validationId, indicator_id: _indicatorId, ...entry }) => entry);

    const detail: ReviewItemDetail = {
      review_item: item,
      recommended_action: `${item.validation_name} flagged ${item.indicator_name} for ${item.flagged_periods.join(
        ", ",
      )}. Review whether the flagged periods reflect an intentional update. If raising this item, ask for a concise explanation of the driver and whether related series should move consistently.`,
      main_series: mainSeries,
      issue_report_entries: history,
      related_indicators: item.has_related_indicators ? mockRelatedIndicatorSeries[item.indicator_id] : [],
    };

    return [item.review_item_id, detail];
  }),
);

export const mockDraftSnippets: Record<string, DraftSnippet> = {
  "ri-001": {
    review_item_id: "ri-001",
    ai_text:
      "Could the team clarify the main driver of the recent revision to the real output path in the flagged periods?",
    user_edited_text: "",
    status: "draft",
    generated_at: "2026-05-20T10:10:00",
  },
  "ri-004": {
    review_item_id: "ri-004",
    ai_text: "",
    user_edited_text: "",
    status: "error",
    mock_error: "Mock draft generation error for UI testing.",
  },
};

export const mockEvidenceSelections: Record<string, EvidenceSelection> = Object.fromEntries(
  mockReviewItems.map((item) => [
    item.review_item_id,
    {
      review_item_id: item.review_item_id,
      include_line_chart: true,
      include_current_data_table: false,
      include_related_indicator_table: false,
      display_time_range: [
        item.frequency === "Q" ? QUARTERLY_PERIODS[0] : ANNUAL_PERIODS[0],
        item.frequency === "Q" ? QUARTERLY_PERIODS[QUARTERLY_PERIODS.length - 1] : ANNUAL_PERIODS[ANNUAL_PERIODS.length - 1],
      ],
      evidence_range: [item.flagged_periods[0], item.flagged_periods[item.flagged_periods.length - 1]],
      temporary_highlights: [],
      saved_highlights: item.flagged_periods.map((period) => ({
        highlight_id: `flag-${item.review_item_id}-${period}`,
        target: "chart_point",
        period_start: period,
        period_end: period,
        style: "flagged",
        note: "Default mock flagged point highlight",
      })),
    },
  ]),
);
