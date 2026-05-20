import type {
  DraftSnippet,
  EvidenceSelection,
  IssueReportEntry,
  RelatedIndicatorRow,
  ReviewItem,
  ReviewItemDetail,
  ReviewSession,
  TimeSeriesPoint,
} from "../types/review";

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
  real: { code: "01", label: "01 - National Accounts - Real" },
  nominal: { code: "02", label: "02 - National Accounts - Nominal" },
  price: { code: "03", label: "03 - Price, Labor, Monetary" },
  fiscal: { code: "04", label: "04 - Fiscal" },
  trade: { code: "05", label: "05 - Trade" },
  bop: { code: "06", label: "06 - BOP" },
  qna: { code: "09", label: "09 - Q-National Accounts" },
  qprice: { code: "10", label: "10 - Q-Price, Labor" },
};

type IndicatorConfig = {
  indicator_id: string;
  indicator_label: string;
  descriptor: string;
  base: number;
  step: number;
  previousOffset: number;
  publishedOffset?: number;
  formula?: string;
  desk_series?: string;
};

const INDICATORS: Record<string, IndicatorConfig> = {
  MCK_RGDP: {
    indicator_id: "MCK_RGDP",
    indicator_label: "Real output volume index",
    descriptor: "Synthetic real activity indicator, index level",
    base: 92,
    step: 2.4,
    previousOffset: -1.6,
    publishedOffset: -2.1,
    formula: "Aggregate real output / base-year aggregate real output * 100",
  },
  MCK_NGDP: {
    indicator_id: "MCK_NGDP",
    indicator_label: "Nominal output value",
    descriptor: "Synthetic nominal aggregate, local units",
    base: 420,
    step: 22,
    previousOffset: -14,
    publishedOffset: -18,
    desk_series: "mock_nominal_output_value",
  },
  MCK_CPI: {
    indicator_id: "MCK_CPI",
    indicator_label: "Consumer price index",
    descriptor: "Synthetic consumer price index",
    base: 101,
    step: 3.1,
    previousOffset: -0.8,
    publishedOffset: -1.2,
    desk_series: "mock_cpi_index",
  },
  MCK_UNEMP: {
    indicator_id: "MCK_UNEMP",
    indicator_label: "Labor slack rate",
    descriptor: "Synthetic labor market rate",
    base: 7.6,
    step: -0.15,
    previousOffset: 0.25,
    desk_series: "mock_labor_slack_rate",
  },
  MCK_REV: {
    indicator_id: "MCK_REV",
    indicator_label: "General revenue ratio",
    descriptor: "Synthetic government revenue as a ratio",
    base: 23.4,
    step: 0.2,
    previousOffset: -0.4,
    formula: "General revenue / nominal output * 100",
  },
  MCK_EXP: {
    indicator_id: "MCK_EXP",
    indicator_label: "General expenditure ratio",
    descriptor: "Synthetic government expenditure as a ratio",
    base: 27.8,
    step: 0.1,
    previousOffset: 0.5,
    desk_series: "mock_expenditure_ratio",
  },
  MCK_EXPORTS: {
    indicator_id: "MCK_EXPORTS",
    indicator_label: "External sales value",
    descriptor: "Synthetic export-like flow",
    base: 145,
    step: 6.4,
    previousOffset: -4.2,
    publishedOffset: -3.4,
    desk_series: "mock_external_sales_value",
  },
  MCK_IMPORTS: {
    indicator_id: "MCK_IMPORTS",
    indicator_label: "External purchases value",
    descriptor: "Synthetic import-like flow",
    base: 168,
    step: 5.8,
    previousOffset: 3.5,
    desk_series: "mock_external_purchases_value",
  },
  MCK_QGDP: {
    indicator_id: "MCK_QGDP",
    indicator_label: "Quarterly real activity index",
    descriptor: "Synthetic quarterly real activity indicator",
    base: 98,
    step: 0.9,
    previousOffset: -0.7,
    formula: "Quarterly activity / quarterly base activity * 100",
  },
  MCK_QCPI: {
    indicator_id: "MCK_QCPI",
    indicator_label: "Quarterly price index",
    descriptor: "Synthetic quarterly price index",
    base: 104,
    step: 0.8,
    previousOffset: -0.4,
    publishedOffset: -0.6,
    desk_series: "mock_quarterly_price_index",
  },
};

function makeSeries(
  periods: string[],
  indicator: IndicatorConfig,
  flaggedPeriods: string[],
  offset = 0,
  nullPeriods: string[] = [],
): TimeSeriesPoint[] {
  return periods.map((period, index) => {
    const wave = Math.sin(index / 2) * Math.max(Math.abs(indicator.step) * 0.35, 0.25);
    const value = nullPeriods.includes(period)
      ? null
      : Number((indicator.base + indicator.step * index + offset + wave).toFixed(1));

    return {
      period,
      value,
      is_flagged: flaggedPeriods.includes(period),
      change_type: flaggedPeriods.includes(period)
        ? index % 2 === 0
          ? "updated"
          : "added"
        : "unchanged",
      note: flaggedPeriods.includes(period) ? "Mock flagged value" : undefined,
    };
  });
}

function reviewItem(params: {
  id: string;
  sector: { code: string; label: string };
  severity: ReviewItem["severity"];
  validation_id: string;
  validation_label: string;
  indicator: IndicatorConfig;
  flagged_periods: string[];
  has_published?: boolean;
  has_related_indicators?: boolean;
  is_quarterly?: boolean;
}): ReviewItem {
  return {
    review_item_id: params.id,
    country_iso: "XFA",
    sector_code: params.sector.code,
    sector_label: params.sector.label,
    severity: params.severity,
    validation_id: params.validation_id,
    validation_label: params.validation_label,
    indicator_id: params.indicator.indicator_id,
    indicator_label: params.indicator.indicator_label,
    flagged_periods: params.flagged_periods,
    flagged_data_point_count: params.flagged_periods.length,
    has_published: params.has_published ?? Boolean(params.indicator.publishedOffset),
    has_related_indicators: params.has_related_indicators ?? true,
    is_quarterly: params.is_quarterly ?? false,
  };
}

export const mockReviewItems: ReviewItem[] = [
  reviewItem({
    id: "ri-001",
    sector: SECTORS.real,
    severity: "Critical",
    validation_id: "CRIT_REVISION_SPIKE",
    validation_label: "Critical - Large revision in recent periods",
    indicator: INDICATORS.MCK_RGDP,
    flagged_periods: ["2025", "2026"],
  }),
  reviewItem({
    id: "ri-002",
    sector: SECTORS.real,
    severity: "High",
    validation_id: "HIGH_LEVEL_BREAK",
    validation_label: "High - Level break against previous submission",
    indicator: INDICATORS.MCK_RGDP,
    flagged_periods: ["2024"],
  }),
  reviewItem({
    id: "ri-003",
    sector: SECTORS.nominal,
    severity: "High",
    validation_id: "HIGH_NOMINAL_REAL_GAP",
    validation_label: "High - Nominal and real movement diverge",
    indicator: INDICATORS.MCK_NGDP,
    flagged_periods: ["2026", "2027"],
  }),
  reviewItem({
    id: "ri-004",
    sector: SECTORS.price,
    severity: "Critical",
    validation_id: "CRIT_PRICE_ACCELERATION",
    validation_label: "Critical - Price path acceleration",
    indicator: INDICATORS.MCK_CPI,
    flagged_periods: ["2024", "2025", "2026"],
  }),
  reviewItem({
    id: "ri-005",
    sector: SECTORS.price,
    severity: "Low",
    validation_id: "LOW_LABOR_GAP",
    validation_label: "Low - Labor rate differs from expected path",
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
    validation_label: "High - Fiscal ratio changed materially",
    indicator: INDICATORS.MCK_REV,
    flagged_periods: ["2025", "2026"],
  }),
  reviewItem({
    id: "ri-007",
    sector: SECTORS.fiscal,
    severity: "Low",
    validation_id: "LOW_SMOOTHING_CHECK",
    validation_label: "Low - Smoothness check flagged out-year movement",
    indicator: INDICATORS.MCK_EXP,
    flagged_periods: ["2028"],
    has_published: false,
  }),
  reviewItem({
    id: "ri-008",
    sector: SECTORS.trade,
    severity: "High",
    validation_id: "HIGH_FLOW_REVISION",
    validation_label: "High - External flow revision exceeds threshold",
    indicator: INDICATORS.MCK_EXPORTS,
    flagged_periods: ["2024", "2025"],
  }),
  reviewItem({
    id: "ri-009",
    sector: SECTORS.trade,
    severity: "Critical",
    validation_id: "CRIT_BALANCE_INCONSISTENCY",
    validation_label: "Critical - Flow consistency check failed",
    indicator: INDICATORS.MCK_IMPORTS,
    flagged_periods: ["2025"],
    has_published: false,
  }),
  reviewItem({
    id: "ri-010",
    sector: SECTORS.bop,
    severity: "Low",
    validation_id: "LOW_METADATA_REVIEW",
    validation_label: "Low - Metadata review recommended",
    indicator: INDICATORS.MCK_EXPORTS,
    flagged_periods: ["2027"],
  }),
  reviewItem({
    id: "ri-011",
    sector: SECTORS.qna,
    severity: "High",
    validation_id: "HIGH_Q_REVISION",
    validation_label: "High - Quarterly revision concentrated in latest quarters",
    indicator: INDICATORS.MCK_QGDP,
    flagged_periods: ["2025Q3", "2025Q4", "2026Q1"],
    is_quarterly: true,
    has_published: false,
  }),
  reviewItem({
    id: "ri-012",
    sector: SECTORS.qprice,
    severity: "Critical",
    validation_id: "CRIT_Q_PRICE_JUMP",
    validation_label: "Critical - Quarterly price index jump",
    indicator: INDICATORS.MCK_QCPI,
    flagged_periods: ["2025Q2", "2025Q3"],
    is_quarterly: true,
  }),
];

export const mockReviewSession: ReviewSession = {
  session_id: "mock-session-2026-05",
  country: {
    iso: "XFA",
    name: "Fictional Economy A",
  },
  submission: {
    submission_id: "mock-submission-alpha",
    submission_timestamp: "2026-05-20T09:00:00",
    status_label: "Mock submission loaded",
    reviewer: "Demo Reviewer",
    submitted_by: "Demo Country Team",
  },
  has_quarterly_data: true,
  review_item_ids: mockReviewItems.map((item) => item.review_item_id),
};

export const mockEmptyReviewSession: ReviewSession = {
  session_id: "mock-empty-session",
  country: {
    iso: "XFB",
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

const issueReportEntries: IssueReportEntry[] = [
  {
    issue_report_entry_id: "issue-history-001",
    validation_id: "CRIT_REVISION_SPIKE",
    indicator_id: "MCK_RGDP",
    period_start: "2023",
    period_end: "2024",
    explanation:
      "Previous mock review noted a methodology update in the recent history. The explanation was accepted for that cycle, but reviewers asked that future out-year changes be documented separately.",
    confirmed_by: "Demo Reviewer",
    confirmed_at: "2026-01-15",
  },
  {
    issue_report_entry_id: "issue-history-002",
    validation_id: "CRIT_REVISION_SPIKE",
    indicator_id: "MCK_RGDP",
    period_start: "2025",
    explanation:
      "Mock confirmation stated that the new path reflected a revised source assumption rather than a data entry issue.",
    confirmed_by: "Demo Reviewer",
    confirmed_at: "2026-02-02",
  },
  {
    issue_report_entry_id: "issue-history-003",
    validation_id: "HIGH_RATIO_SHIFT",
    indicator_id: "MCK_REV",
    period_start: "2024",
    period_end: "2026",
    explanation:
      "The ratio change was previously described as a classification update. This longer mock text is intentionally two to three lines in a compact layout so the UI can test clamp, expand, and popover behavior without relying on real review language.",
    confirmed_by: "Demo Reviewer",
    confirmed_at: "2026-03-18",
  },
  {
    issue_report_entry_id: "issue-history-004",
    validation_id: "CRIT_Q_PRICE_JUMP",
    indicator_id: "MCK_QCPI",
    period_start: "2025Q2",
    period_end: "2025Q3",
    explanation:
      "Quarterly mock explanation: short-lived index movement was previously attributed to a synthetic timing shift.",
    confirmed_by: "Demo Reviewer",
    confirmed_at: "2026-04-04",
  },
];

function relatedRows(
  periods: string[],
  indicator: IndicatorConfig,
  flaggedPeriods: string[],
): RelatedIndicatorRow[] {
  return [
    {
      related_indicator_id: `${indicator.indicator_id}_R1`,
      related_indicator_label: `${indicator.indicator_label} - related level`,
      relationship_type: "supporting series",
      change_type: "updated",
      values: makeSeries(periods, indicator, flaggedPeriods, indicator.previousOffset * 0.5),
    },
    {
      related_indicator_id: `${indicator.indicator_id}_R2`,
      related_indicator_label: `${indicator.indicator_label} - related ratio`,
      relationship_type: "derived comparison",
      change_type: "added",
      values: makeSeries(periods, { ...indicator, base: indicator.base * 0.12, step: indicator.step * 0.08 }, flaggedPeriods),
    },
  ];
}

export const mockReviewItemDetails: Record<string, ReviewItemDetail> = Object.fromEntries(
  mockReviewItems.map((item) => {
    const indicator = INDICATORS[item.indicator_id];
    const periods = item.is_quarterly ? QUARTERLY_PERIODS : ANNUAL_PERIODS;
    const nullPeriods = item.review_item_id === "ri-007" ? ["2022"] : [];
    const history = issueReportEntries.filter(
      (entry) => entry.validation_id === item.validation_id && entry.indicator_id === item.indicator_id,
    );

    const detail: ReviewItemDetail = {
      ...item,
      validation_explanation: `${item.validation_label} flagged ${item.indicator_label} for ${item.flagged_periods.join(
        ", ",
      )}. This is mock explanatory text for frontend review only.`,
      recommended_action:
        "Review whether the flagged periods reflect an intentional update. If raising this item, ask for a concise explanation of the driver and whether related series should move consistently.",
      rule_name: item.validation_id,
      rule_description:
        "Synthetic validation rule used to exercise UI behavior. It does not describe a real WEO rule.",
      descriptor: indicator.descriptor,
      formula: indicator.formula,
      desk_series: indicator.desk_series,
      metadata: {
        frequency: item.is_quarterly ? "Quarterly" : "Annual",
        unit: item.indicator_id.includes("CPI") ? "Index" : "Mock units",
        source_type: indicator.formula ? "Derived indicator" : "Direct submitted indicator",
        confidentiality: "Mock data only",
      },
      series: {
        current: makeSeries(periods, indicator, item.flagged_periods, 0, nullPeriods),
        previous: makeSeries(periods, indicator, item.flagged_periods, indicator.previousOffset, nullPeriods),
        published:
          item.has_published && indicator.publishedOffset !== undefined
            ? makeSeries(periods, indicator, item.flagged_periods, indicator.publishedOffset)
            : undefined,
      },
      issue_report_entries: history,
      related_indicators: item.has_related_indicators ? relatedRows(periods, indicator, item.flagged_periods) : [],
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
        item.is_quarterly ? QUARTERLY_PERIODS[0] : ANNUAL_PERIODS[0],
        item.is_quarterly ? QUARTERLY_PERIODS[QUARTERLY_PERIODS.length - 1] : ANNUAL_PERIODS[ANNUAL_PERIODS.length - 1],
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
