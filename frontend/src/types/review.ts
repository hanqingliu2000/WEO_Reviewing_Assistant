export type Severity = "Critical" | "High" | "Low" | "Other";

export type ChangeType = "added" | "updated" | "unchanged";

export type DraftStatus = "empty" | "generating" | "draft" | "kept" | "edited" | "error";

export type HighlightTarget =
  | "chart_point"
  | "chart_region"
  | "table_cell"
  | "table_row"
  | "table_column";

export type ReviewSession = {
  session_id: string;
  country: {
    iso: string;
    name: string;
  };
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

export type ReviewItem = {
  review_item_id: string;
  country_iso: string;
  sector_code: string;
  sector_label: string;
  severity: Severity;
  validation_id: string;
  validation_label: string;
  indicator_id: string;
  indicator_label: string;
  flagged_periods: string[];
  flagged_data_point_count: number;
  has_published: boolean;
  has_related_indicators: boolean;
  is_quarterly: boolean;
};

export type TimeSeriesPoint = {
  period: string;
  value: number | null;
  is_flagged?: boolean;
  change_type?: ChangeType;
  note?: string;
};

export type RelatedIndicatorRow = {
  related_indicator_id: string;
  related_indicator_label: string;
  relationship_type?: string;
  values: TimeSeriesPoint[];
  change_type?: ChangeType;
};

export type IssueReportEntry = {
  issue_report_entry_id: string;
  validation_id: string;
  indicator_id: string;
  period_start: string;
  period_end?: string;
  explanation: string;
  confirmed_by?: string;
  confirmed_at?: string;
};

export type ReviewItemDetail = ReviewItem & {
  validation_explanation: string;
  recommended_action: string;
  rule_name: string;
  rule_description?: string;
  descriptor?: string;
  formula?: string;
  desk_series?: string;
  metadata: Record<string, string | number | boolean | null>;
  series: {
    current: TimeSeriesPoint[];
    previous: TimeSeriesPoint[];
    published?: TimeSeriesPoint[];
  };
  issue_report_entries: IssueReportEntry[];
  related_indicators: RelatedIndicatorRow[];
};

export type DraftSnippet = {
  review_item_id: string;
  ai_text: string;
  user_edited_text: string;
  status: DraftStatus;
  generated_at?: string;
  mock_error?: string;
};

export type Highlight = {
  highlight_id: string;
  target: HighlightTarget;
  period_start?: string;
  period_end?: string;
  row_id?: string;
  column_id?: string;
  style: "flagged" | "manual" | "emphasis";
  note?: string;
};

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

export type EmailDraftOutput = {
  session_id: string;
  generated_at: string;
  sector_groups: Array<{
    sector_code: string;
    sector_label: string;
    indicator_groups: Array<{
      indicator_id: string;
      indicator_label: string;
      review_item_ids: string[];
      merged_text: string;
    }>;
  }>;
};
