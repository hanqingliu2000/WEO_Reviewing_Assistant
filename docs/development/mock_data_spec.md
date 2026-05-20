# Mock Data Spec For Frontend Development

## Purpose

This document defines the synthetic data needed for frontend development before real data mapping exists. It is not the final backend data contract.

The mock dataset should let the frontend implement and test:

- navigation,
- chart and table rendering,
- issues report history,
- related indicators,
- draft state,
- evidence selection,
- completion flow.

All mock data must remain fictional. Do not use real country names, real values, real validation output, internal paths, source report media, or confidential examples.

## Required Scenarios

The mock data should cover:

- multiple sectors,
- conditional quarterly sectors,
- `Critical`, `High`, and `Low` severity groups,
- multiple validations,
- one indicator flagged by multiple validations,
- annual periods,
- quarterly periods,
- enough periods to force horizontal table scrolling,
- current and previous series for every indicator,
- optional published series,
- missing published series,
- missing related indicators,
- issues report entries present and absent,
- long issues report explanations,
- more than one flagged data point,
- null values,
- derived indicator with formula,
- direct submitted indicator with desk series,
- no-issue completion path,
- kept/edited output path,
- mock draft generation error.

## Current Mock Files

- `frontend/src/types/review.ts`
- `frontend/src/data/mockReviewData.ts`

The current mock dataset includes:

- `mockReviewSession`
- `mockEmptyReviewSession`
- `mockReviewItems`
- `mockReviewItemDetails`
- `mockDraftSnippets`
- `mockEvidenceSelections`

## Conceptual Objects

### `ReviewSession`

Session-level metadata and a list of review item ids.

Required fields:

- `session_id`
- `country.iso`
- `country.name`
- `submission.submission_id`
- `submission.submission_timestamp`
- `submission.status_label`
- `has_quarterly_data`
- `review_item_ids`

### `ReviewItem`

Lightweight navigation object for one selectable review pair.

Required fields:

- `review_item_id`
- `country_iso`
- `sector_code`
- `sector_label`
- `severity`
- `validation_id`
- `validation_label`
- `indicator_id`
- `indicator_label`
- `flagged_periods`
- `flagged_data_point_count`
- `has_published`
- `has_related_indicators`
- `is_quarterly`

### `ReviewItemDetail`

Detailed object used by the center review surface.

Additional fields:

- `validation_explanation`
- `recommended_action`
- `rule_name`
- `rule_description`
- `descriptor`
- `formula`
- `desk_series`
- `metadata`
- `series.current`
- `series.previous`
- `series.published`
- `issue_report_entries`
- `related_indicators`

### `TimeSeriesPoint`

One period/value observation.

Fields:

- `period`
- `value`
- `is_flagged`
- `change_type`
- `note`

### `IssueReportEntry`

Prior explanation or confirmation tied to validation and indicator.

Fields:

- `issue_report_entry_id`
- `validation_id`
- `indicator_id`
- `period_start`
- `period_end`
- `explanation`
- `confirmed_by`
- `confirmed_at`

### `DraftSnippet`

Mock AI draft state for one review item.

Fields:

- `review_item_id`
- `ai_text`
- `user_edited_text`
- `status`
- `generated_at`
- `mock_error`

Allowed status values:

- `empty`
- `generating`
- `draft`
- `kept`
- `edited`
- `error`

### `EvidenceSelection`

Per-item evidence state.

Defaults:

- `include_line_chart = true`
- `include_current_data_table = false`
- `include_related_indicator_table = false`

Other fields:

- `display_time_range`
- `evidence_range`
- `temporary_highlights`
- `saved_highlights`

## Consistency Rules

- `review_item_id` must be stable and unique.
- The same indicator under different validations should share chart/table series.
- The same indicator under different validations can have different explanations and flagged periods.
- Related indicators are keyed by `indicator_id`, not by validation.
- Issues report entries are filtered by `validation_id + indicator_id`.
- Severity can be derived from the validation label prefix, but mock data may store it directly.
- Flagged periods must exist in current series.
- Quarterly periods must be sortable.
- Tables should include enough periods to test default rightmost/latest-period scrolling.

## Later Real Mapping Questions

When real test data becomes available, confirm:

- source table for validation results,
- source field for sector,
- source field for validation/rule,
- source field for indicator,
- how severity is encoded,
- where current/previous/published values come from,
- annual versus quarterly period format,
- related indicator source,
- issues report source and join keys,
- formula, desk series, and descriptor source,
- flagged data point representation,
- recommended action source.
