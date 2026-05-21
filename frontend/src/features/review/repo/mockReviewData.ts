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

const ANNUAL_PERIODS = [
  "2015",
  "2016",
  "2017",
  "2018",
  "2019",
  "2020",
  "2021",
  "2022",
  "2023",
  "2024",
  "2025",
  "2026",
  "2027",
  "2028",
];

const QUARTERLY_PERIODS = [
  "2023Q1",
  "2023Q2",
  "2023Q3",
  "2023Q4",
  "2024Q1",
  "2024Q2",
  "2024Q3",
  "2024Q4",
  "2025Q1",
  "2025Q2",
  "2025Q3",
  "2025Q4",
  "2026Q1",
  "2026Q2",
];

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
  MCK_RGDP: {
    indicator_id: "MCK_RGDP",
    indicator_name: "Real output volume index",
    frequency: "A",
    descriptor: "Synthetic real activity indicator, index level",
    base: 92,
    step: 2.4,
    previous_offset: -1.6,
    published_offset: -2.1,
    formula: "Aggregate real output / base-year aggregate real output * 100",
  },
  MCK_NGDP: {
    indicator_id: "MCK_NGDP",
    indicator_name: "Nominal output value",
    frequency: "A",
    descriptor: "Synthetic nominal aggregate, local units",
    base: 420,
    step: 22,
    previous_offset: -14,
    published_offset: -18,
    desk_series: "mock_nominal_output_value",
  },
  MCK_CPI: {
    indicator_id: "MCK_CPI",
    indicator_name: "Consumer price index",
    frequency: "A",
    descriptor: "Synthetic consumer price index",
    base: 101,
    step: 3.1,
    previous_offset: -0.8,
    published_offset: -1.2,
    desk_series: "mock_cpi_index",
  },
  MCK_UNEMP: {
    indicator_id: "MCK_UNEMP",
    indicator_name: "Labor slack rate",
    frequency: "A",
    descriptor: "Synthetic labor market rate",
    base: 7.6,
    step: -0.15,
    previous_offset: 0.25,
    desk_series: "mock_labor_slack_rate",
  },
  MCK_REV: {
    indicator_id: "MCK_REV",
    indicator_name: "General revenue ratio",
    frequency: "A",
    descriptor: "Synthetic government revenue as a ratio",
    base: 23.4,
    step: 0.2,
    previous_offset: -0.4,
    formula: "General revenue / nominal output * 100",
  },
  MCK_EXP: {
    indicator_id: "MCK_EXP",
    indicator_name: "General expenditure ratio",
    frequency: "A",
    descriptor: "Synthetic government expenditure as a ratio",
    base: 27.8,
    step: 0.1,
    previous_offset: 0.5,
    desk_series: "mock_expenditure_ratio",
  },
  MCK_EXPORTS: {
    indicator_id: "MCK_EXPORTS",
    indicator_name: "External sales value",
    frequency: "A",
    descriptor: "Synthetic export-like flow",
    base: 145,
    step: 6.4,
    previous_offset: -4.2,
    published_offset: -3.4,
    desk_series: "mock_external_sales_value",
  },
  MCK_IMPORTS: {
    indicator_id: "MCK_IMPORTS",
    indicator_name: "External purchases value",
    frequency: "A",
    descriptor: "Synthetic import-like flow",
    base: 168,
    step: 5.8,
    previous_offset: 3.5,
    desk_series: "mock_external_purchases_value",
  },
  MCK_QGDP: {
    indicator_id: "MCK_QGDP",
    indicator_name: "Quarterly real activity index",
    frequency: "Q",
    descriptor: "Synthetic quarterly real activity indicator",
    base: 98,
    step: 0.9,
    previous_offset: -0.7,
    formula: "Quarterly activity / quarterly base activity * 100",
  },
  MCK_QCPI: {
    indicator_id: "MCK_QCPI",
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
      null_periods: indicator.indicator_id === "MCK_EXP" ? ["2022"] : [],
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

export const mockReviewItems: ReviewItem[] = [
  reviewItem({
    id: "ri-001",
    sector: SECTORS.real,
    severity: "Critical",
    validation_id: "CRIT_REVISION_SPIKE",
    validation_name: "Critical - Large revision in recent periods",
    indicator: INDICATORS.MCK_RGDP,
    flagged_periods: ["2025", "2026"],
  }),
  reviewItem({
    id: "ri-002",
    sector: SECTORS.real,
    severity: "High",
    validation_id: "HIGH_LEVEL_BREAK",
    validation_name: "High - Level break against previous submission",
    indicator: INDICATORS.MCK_RGDP,
    flagged_periods: ["2024"],
  }),
  reviewItem({
    id: "ri-003",
    sector: SECTORS.nominal,
    severity: "High",
    validation_id: "HIGH_NOMINAL_REAL_GAP",
    validation_name: "High - Nominal and real movement diverge",
    indicator: INDICATORS.MCK_NGDP,
    flagged_periods: ["2026", "2027"],
  }),
  reviewItem({
    id: "ri-004",
    sector: SECTORS.price,
    severity: "Critical",
    validation_id: "CRIT_PRICE_ACCELERATION",
    validation_name: "Critical - Price path acceleration",
    indicator: INDICATORS.MCK_CPI,
    flagged_periods: ["2024", "2025", "2026"],
  }),
  reviewItem({
    id: "ri-005",
    sector: SECTORS.price,
    severity: "Low",
    validation_id: "LOW_LABOR_GAP",
    validation_name: "Low - Labor rate differs from expected path",
    indicator: INDICATORS.MCK_UNEMP,
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
    indicator: INDICATORS.MCK_REV,
    flagged_periods: ["2025", "2026"],
  }),
  reviewItem({
    id: "ri-007",
    sector: SECTORS.fiscal,
    severity: "Low",
    validation_id: "LOW_SMOOTHING_CHECK",
    validation_name: "Low - Smoothness check flagged out-year movement",
    indicator: INDICATORS.MCK_EXP,
    flagged_periods: ["2028"],
    has_published: false,
  }),
  reviewItem({
    id: "ri-008",
    sector: SECTORS.trade,
    severity: "High",
    validation_id: "HIGH_FLOW_REVISION",
    validation_name: "High - External flow revision exceeds threshold",
    indicator: INDICATORS.MCK_EXPORTS,
    flagged_periods: ["2024", "2025"],
  }),
  reviewItem({
    id: "ri-009",
    sector: SECTORS.trade,
    severity: "Critical",
    validation_id: "CRIT_BALANCE_INCONSISTENCY",
    validation_name: "Critical - Flow consistency check failed",
    indicator: INDICATORS.MCK_IMPORTS,
    flagged_periods: ["2025"],
    has_published: false,
  }),
  reviewItem({
    id: "ri-010",
    sector: SECTORS.bop,
    severity: "Low",
    validation_id: "LOW_METADATA_REVIEW",
    validation_name: "Low - Metadata review recommended",
    indicator: INDICATORS.MCK_EXPORTS,
    flagged_periods: ["2027"],
  }),
  reviewItem({
    id: "ri-011",
    sector: SECTORS.qna,
    severity: "High",
    validation_id: "HIGH_Q_REVISION",
    validation_name: "High - Quarterly revision concentrated in latest quarters",
    indicator: INDICATORS.MCK_QGDP,
    flagged_periods: ["2025Q3", "2025Q4", "2026Q1"],
    has_published: false,
  }),
  reviewItem({
    id: "ri-012",
    sector: SECTORS.qprice,
    severity: "Critical",
    validation_id: "CRIT_Q_PRICE_JUMP",
    validation_name: "Critical - Quarterly price index jump",
    indicator: INDICATORS.MCK_QCPI,
    flagged_periods: ["2025Q2", "2025Q3"],
  }),
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
    indicator_id: "MCK_RGDP",
    period_range: "2023-2024",
    explanation:
      "Previous mock review noted a methodology update in the recent history. The explanation was accepted for that cycle, but reviewers asked that future out-year changes be documented separately.",
  },
  {
    issue_report_entry_id: "issue-history-002",
    validation_id: "CRIT_REVISION_SPIKE",
    indicator_id: "MCK_RGDP",
    period_range: "2025",
    explanation:
      "Mock confirmation stated that the new path reflected a revised source assumption rather than a data entry issue.",
  },
  {
    issue_report_entry_id: "issue-history-003",
    validation_id: "HIGH_RATIO_SHIFT",
    indicator_id: "MCK_REV",
    period_range: "2024-2026",
    explanation:
      "The ratio change was previously described as a classification update. This longer mock text is intentionally two to three lines in a compact layout so the UI can test clamp, expand, and popover behavior without relying on real review language.",
  },
  {
    issue_report_entry_id: "issue-history-004",
    validation_id: "CRIT_Q_PRICE_JUMP",
    indicator_id: "MCK_QCPI",
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
