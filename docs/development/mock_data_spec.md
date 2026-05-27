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
- multiple indicators under each validation,
- at least one dense validation group with roughly 15-20 indicators to exercise navigation scrolling and keyboard traversal,
- one indicator flagged by multiple validations,
- annual periods such as `2025`,
- quarterly periods such as `2025Q1`,
- enough periods to force horizontal table scrolling,
- current and previous series for every indicator,
- optional published series,
- missing published series,
- missing related indicators,
- issues report entries present and absent,
- long issues report explanations,
- more than one flagged period,
- null values,
- derived indicator with formula,
- direct submitted indicator with desk series,
- no-issue completion path,
- kept/edited output path,
- mock draft generation error.

## Current Mock Files

- `frontend/src/features/review/types/review.ts`
- `frontend/src/features/review/repo/mockReviewData.ts`

The current mock dataset includes:

- `mockReviewSession`
- `mockEmptyReviewSession`
- `mockReviewItems`
- `mockIndicatorSeriesSets`
- `mockRelatedIndicatorSeries`
- `mockReviewItemDetails`
- `mockDraftSnippets`
- `mockEvidenceSelections`

## Conceptual Objects

### `ReviewSession`

Session-level metadata and a list of review item ids.

Required fields:

- `session_id`
- `country.numeric_code`
- `country.iso_code`
- `country.name`
- `submission.submission_id`
- `submission.submission_timestamp`
- `submission.status_label`
- `has_quarterly_data`
- `review_item_ids`

Notes:

- `country.numeric_code` is the internal three-digit code used by backend lookup and ETL joins.
- `country.iso_code` and `country.name` are display-facing fields.
- `has_quarterly_data` should be derived from whether any source data has quarterly frequency.

### `ReviewItem`

Lightweight navigation object for one selectable `sector + validation + indicator` pair.

Required fields:

- `review_item_id`
- `country_numeric_code`
- `country_iso_code`
- `sector_code`
- `sector_name`
- `severity`
- `validation_id`
- `validation_name`
- `indicator_id`
- `indicator_name`
- `frequency`
- `flagged_periods`
- `flagged_data_point_count`
- `has_published`
- `has_related_indicators`

Notes:

- `ReviewItem` owns the active validation flag context.
- The same indicator under different validations should produce separate `ReviewItem` records.
- `severity` is derived from the validation type/prefix and does not depend on the indicator.
- `flagged_periods` may be parsed from source text before it reaches the frontend.

### `TimeSeriesPoint`

One period/value observation.

Fields:

- `period`
- `value`

Notes:

- `period` is a display-safe string key such as `2025` or `2025Q1`.
- `TimeSeriesPoint` should not store validation flag state.
- Chart/table highlighting comes from the active `ReviewItem.flagged_periods`.

### `TimeSeries`

Reusable data series for one indicator and one version.

Required fields:

- `series_id`
- `indicator_id`
- `indicator_name`
- `frequency`
- `points`

Notes:

- `current`, `previous`, `published`, main indicators, and related indicators all reuse this shape.
- The same `TimeSeries` can be reused across multiple `ReviewItem` records for the same indicator.

### `IndicatorSeriesSet`

Current/previous/published series and metadata for one report indicator.

Required fields:

- `indicator_id`
- `indicator_name`
- `current`
- `previous`

Optional fields:

- `descriptor`
- `formula`
- `desk_series`
- `published`

Notes:

- Every main indicator should have current and previous series.
- Published is optional. When present in mock data, the frontend may display it directly with current and previous series; no options menu is required for the current center-surface slice.

### `RelatedIndicatorSeries`

Related/involved indicator series shown for the selected report indicator.

Fields:

- Same shape as `IndicatorSeriesSet`.

Notes:

- A report indicator can map to multiple related/involved indicators.
- Related indicators only follow the selected indicator.
- Related indicators should not be filtered by sector, severity, or validation.
- No separate `relationship_type` field is needed for MVP; the relationship is simply related/involved.

### `ReviewItemDetail`

Detailed object used by the center review surface and AI draft context.

Fields:

- `review_item`
- `recommended_action`
- `main_series`
- `issue_report_entries`
- `related_indicators`

Notes:

- `recommended_action` is the backend-provided validation guidance/action field.
- Do not split `recommended_action` into separate explanation/action fields unless the source data later changes.
- Do not use `validation_explanation` for this field because issues report entries also have explanations.

### `IssueReportEntry`

Prior explanation already scoped to the parent `ReviewItemDetail`.

Fields:

- `issue_report_entry_id`
- `period_range`
- `explanation`

Notes:

- `IssueReportEntry` does not repeat `validation_id` or `indicator_id` inside `ReviewItemDetail`; those keys are already available from `ReviewItemDetail.review_item`.
- `period_range` is a display string such as `2024-2026` or `2025Q2-2025Q3`.
- Confirmation details, if present, should be folded into `explanation`.

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

### `Highlight`

One temporary or saved chart/table highlight.

Fields:

- `highlight_id`
- `target`
- `period_start`
- `period_end`
- `row_id`
- `column_id`
- `style`
- `note`

Notes:

- `style` should support highlighter-like fills and solid outline boxes.
- Exported evidence must preserve the same highlight styling shown on screen.

## Consistency Rules

- `review_item_id` must be stable and unique.
- The same indicator under different validations should share the same reusable time series.
- The same indicator under different validations can have different `recommended_action` text and `flagged_periods`.
- Related indicators are keyed by `indicator_id`, not by validation.
- Issues report entries are filtered by `validation_id + indicator_id`.
- Flagged periods must exist in the main current series.
- Quarterly periods must be sortable by frontend helper logic.
- Tables should include enough periods to test default rightmost/latest-period scrolling.

## Later Real Mapping Questions

When real test data becomes available, confirm:

- source table for validation results,
- source field for internal country numeric code,
- source field for country ISO code,
- source field for sector,
- source field for validation,
- source field for indicator,
- how severity is encoded or derived,
- where current/previous/published values come from,
- annual versus quarterly period format,
- related indicator mapping source,
- issues report source and join keys,
- formula, desk series, and descriptor source,
- flagged period representation,
- recommended action source.
