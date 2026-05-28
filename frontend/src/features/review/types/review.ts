/**
 * Validation severity bucket shown in the left navigation.
 *
 * Use case:
 * - Groups and filters validation rules under the selected sector.
 * - Severity is derived from the validation type/prefix and is independent of
 *   the selected indicator.
 * - Severity only affects the validation list; it should not filter status,
 *   related indicators, or the underlying time series directly.
 */
export type Severity = "Critical" | "High" | "Low";

/**
 * Frequency for a time series.
 *
 * Use case:
 * - Controls period formatting, chart/table navigation, and whether quarterly
 *   sectors should be shown.
 * - `ReviewSession.has_quarterly_data` should be derived from the presence of
 *   at least one quarterly series/data point.
 */
export type Frequency = "A" | "Q";

/**
 * Lifecycle state for the AI draft attached to one selected review item.
 *
 * Use case:
 * - Drives the right-side active draft panel.
 * - Only "kept" and "edited" snippets enter the final email output.
 * - "empty", "generating", and "error" are UI states, not final review decisions.
 */
export type DraftStatus = "empty" | "generating" | "draft" | "kept" | "edited" | "error";

/**
 * Supported places where a reviewer can apply visual highlighting.
 *
 * Use case:
 * - Allows the chart and tables to share one highlight model.
 * - Supports both period-based highlights and table-specific row/cell highlights.
 */
export type HighlightTarget =
  | "chart_point"
  | "chart_region"
  | "table_cell"
  | "table_row"
  | "table_column";

/**
 * Visual treatment for one highlight.
 *
 * Use case:
 * - Keeps the evidence model flexible enough for highlighter-style fills and
 *   solid outline boxes.
 * - Exported evidence should preserve the same treatment shown on screen.
 */
export type HighlightStyle = "flagged" | "manual_fill" | "solid_outline" | "emphasis";

/**
 * Country identity used by both the local API boundary and the UI.
 *
 * Use case:
 * - `numeric_code` is the internal three-digit country code used for backend
 *   lookup and ETL joins.
 * - `iso_code` and `name` are display-facing fields.
 */
export type CountryIdentity = {
  numeric_code: string;
  iso_code: string;
  name: string;
};

/**
 * Top-level review session metadata.
 *
 * Use case:
 * - Loaded when the app starts or when the reviewer chooses a country/session.
 * - Powers the header, country/submission status placeholder, and overall progress.
 * - `review_item_ids` defines the full set of flagged pairs that must be visited
 *   before the reviewer can complete the session.
 */
export type ReviewSession = {
  session_id: string;
  country: CountryIdentity;
  submission: {
    submission_id: string;
    submission_timestamp: string;
    status_label: string;
    reviewer?: string;
    submitted_by?: string;
  };
  has_quarterly_data: boolean;
  review_item_ids: string[];
};

/**
 * Lightweight list item for one selectable sector + validation + indicator pair.
 *
 * Use case:
 * - Primary input for the left navigation tree.
 * - Represents the review unit that the user visits, selects, and may later raise.
 * - The same indicator can appear in multiple ReviewItems when multiple
 *   validations flag it, while all of those items can reuse the same TimeSeries.
 * - Kept intentionally light; flagged periods, availability flags, and evidence
 *   details live in ReviewItemDetail for the center review surface.
 */
export type ReviewItem = {
  review_item_id: string;
  country_numeric_code: string;
  country_iso_code: string;
  sector_code: string;
  sector_name: string;
  severity: Severity;
  validation_id: string;
  validation_name: string;
  indicator_id: string;
  indicator_name: string;
  frequency: Frequency;
  flagged_periods: string[];
  flagged_data_point_count: number;
  has_published: boolean;
  has_related_indicators: boolean;
};

/**
 * One value in a time series.
 *
 * Use case:
 * - Rendered in the main line chart and in current/previous/published data tables.
 * - `period` is a display-safe string key such as "2025" or "2025Q1".
 * - Validation flag highlighting is not stored here; it is driven by the active
 *   ReviewItemDetail's `flagged_periods` so the same TimeSeries can be reused
 *   across multiple validation pairs.
 */
export type TimeSeriesPoint = {
  period: string;
  value: number | null;
};

/**
 * Complete time series for one indicator/version.
 *
 * Use case:
 * - Represents current, previous, published, main indicator, and related
 *   indicator series with one shared shape.
 * - Kept inside each ReviewItemDetail instead of a shared registry because MVP
 *   data size and query efficiency are not current constraints.
 */
export type TimeSeries = {
  series_id: string;
  indicator_id: string;
  indicator_name: string;
  frequency: Frequency;
  name?: string;
  points: TimeSeriesPoint[];
};

/**
 * Current/previous/published series displayed for one indicator.
 *
 * Use case:
 * - Powers the main chart/table area and related indicators table.
 * - Current and previous should exist for every displayed indicator.
 * - Published is optional and can be displayed directly when present.
 */
export type IndicatorSeriesSet = {
  indicator_id: string;
  indicator_name: string;
  descriptor?: string;
  formula?: string;
  desk_series?: string;
  current: TimeSeries;
  previous: TimeSeries;
  published?: TimeSeries;
};

export type RelatedIndicatorSeries = IndicatorSeriesSet;

export type SeriesBundle = Pick<IndicatorSeriesSet, "current" | "previous" | "published">;

/**
 * Indicator display payload for the center review surface.
 *
 * Use case:
 * - Stores the main indicator metadata and its current/previous/published data
 *   directly inside ReviewItemDetail.
 * - Avoids a shared series registry so the shape remains easy to inspect and
 *   easy for Flask to return.
 */
export type IndicatorDisplayData = {
  indicator_id: string;
  indicator_name: string;
  frequency: Frequency;
  descriptor?: string;
  formula?: string;
  desk_series?: string;
  series: SeriesBundle;
};

/**
 * One related/involved indicator shown for the active report indicator.
 *
 * Use case:
 * - Related indicators follow the selected indicator only; they should not be
 *   filtered by sector, validation, or severity.
 * - Each related indicator carries the same direct display payload shape as the
 *   main indicator.
 */
export type RelatedIndicatorData = IndicatorDisplayData;

/**
 * Historical explanation or confirmation from the issues report.
 *
 * Use case:
 * - Displayed between the line chart and related indicators area.
 * - Already scoped by the parent ReviewItemDetail's active validation +
 *   indicator pair, so it does not repeat validation_id or indicator_id.
 * - `period_range` is a display string such as "2024-2026" or "2025Q2-2025Q3".
 * - Confirmation details, if any, are included in `explanation`.
 */
export type IssueReportEntry = {
  issue_report_entry_id: string;
  period_range: string;
  explanation: string;
};

/**
 * Full data payload for the currently active review item.
 *
 * Use case:
 * - Loaded when a reviewer opens one sector + validation + indicator pair.
 * - Combines the active validation context from `review_item` with the center
 *   review surface data for the main indicator and related indicators.
 * - Provides the bounded context that the AI draft generator may use.
 */
export type ReviewItemDetail = {
  review_item: ReviewItem;
  recommended_action: string;
  main_series: IndicatorSeriesSet;
  issue_report_entries: IssueReportEntry[];
  related_indicators: RelatedIndicatorSeries[];
};

/**
 * AI-generated and user-edited text for one review item.
 *
 * Use case:
 * - Drives the right-side active draft card for the current pair.
 * - The original `ai_text` is preserved so the reviewer can compare or regenerate.
 * - `user_edited_text` becomes authoritative once the status is "edited".
 */
export type DraftSnippet = {
  review_item_id: string;
  ai_text: string;
  user_edited_text: string;
  status: DraftStatus;
  generated_at?: string;
  mock_error?: string;
};

/**
 * One saved or temporary highlight on chart/table evidence.
 *
 * Use case:
 * - Temporary highlights support drag interactions before the user saves them.
 * - Saved highlights are restored when the reviewer returns to the same pair.
 * - Exported evidence should preserve the same highlight styling shown on screen.
 */
export type Highlight = {
  highlight_id: string;
  target: HighlightTarget;
  period_start?: string;
  period_end?: string;
  row_id?: string;
  column_id?: string;
  style: HighlightStyle;
  note?: string;
};

/**
 * Period-level highlight payload reserved for the future backend boundary.
 *
 * Use case:
 * - Keeps the v1 frontend highlight interaction simple: chart and tables share
 *   one list of highlighted periods.
 * - Can be sent directly to a later save/load endpoint without tying the UI to
 *   the richer exported-evidence Highlight model too early.
 */
export type HighlightPeriodSource = "default_flagged" | "user_modified";

export type HighlightPeriodPayload = {
  review_item_id: string;
  highlighted_periods: string[];
  source: HighlightPeriodSource;
  updated_at: string;
};

/**
 * Evidence and display settings for one review item.
 *
 * Use case:
 * - Stores what evidence should be exported for a selected pair.
 * - `display_time_range` controls what the chart/table currently shows.
 * - `evidence_range` controls the exported/highlighted evidence window and is
 *   separate from the display range.
 * - Default behavior should include the line chart and exclude optional tables.
 */
export type EvidenceSelection = {
  review_item_id: string;
  include_line_chart: boolean;
  include_current_data_table: boolean;
  include_related_indicator_table: boolean;
  display_time_range: [string, string];
  evidence_range: [string, string];
  temporary_highlights: Highlight[];
  saved_highlights: Highlight[];
};

/**
 * Final merged output after the reviewer completes the session.
 *
 * Use case:
 * - Created only after all flagged pairs have been visited.
 * - Includes kept/edited snippets only.
 * - Groups by sector and merges multiple validation snippets under the same indicator.
 * - Can be rendered in an overall edit screen or exported to an email draft file.
 */
export type EmailDraftOutput = {
  session_id: string;
  generated_at: string;
  sector_groups: Array<{
    sector_code: string;
    sector_name: string;
    indicator_groups: Array<{
      indicator_id: string;
      indicator_name: string;
      review_item_ids: string[];
      merged_text: string;
    }>;
  }>;
};
