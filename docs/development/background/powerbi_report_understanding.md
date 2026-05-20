# Current Validation Report Logic: Frontend Migration Notes

## Purpose

This document records the understood interaction logic of the current validation review report. It is background context for the new local-first workbench, especially left navigation and center review surface behavior.

It does not include source media or sensitive report artifacts.

## Page Structure

The current review flow can be represented as five areas:

1. Submission status area.
2. Fixed sector list.
3. Severity and validation list.
4. Indicator list.
5. Main review area.

The new workbench should preserve the core review logic while improving layout, typography, navigation, state visibility, and evidence management.

## Sector List

Base sectors:

- `01 - National Accounts - Real`
- `02 - National Accounts - Nominal`
- `03 - Price, Labor, Monetary`
- `04 - Fiscal`
- `05 - Trade`
- `06 - BOP`
- `07 - IIP`
- `08 - Debt`

When the current session has quarterly data, add:

- `09 - Q-National Accounts`
- `10 - Q-Price, Labor`

Sector affects validation list, indicator list, and active review context. It does not affect submission status or related indicator definitions.

## Severity And Validation

Severity is derived from the validation name prefix, such as `Critical`, `High`, or `Low`.

Severity is a filter for the validation list only.

Validation affects:

- indicator list,
- flagged period,
- validation explanation,
- current review context,
- draft context.

Validation does not affect related indicators.

## Indicator

Indicator list shows only flagged indicators under the current sector and validation.

Indicator is single-select.

Indicator affects:

- chart,
- current/previous/published table,
- metadata,
- formula,
- desk series,
- related indicators.

## Repeated Indicator Flags

The same indicator can be flagged by multiple validations.

Expected behavior:

- chart/table data stays consistent for the same indicator,
- validation explanation can differ,
- flagged period can differ,
- draft snippets are generated per validation/indicator pair,
- final output merges multiple validations under the same indicator.

## Time Period Control

Time period control changes displayed periods in charts and tables.

It is separate from evidence/highlight range.

Rules:

- display range controls what the reviewer sees,
- evidence range controls saved/exported highlights,
- changing display range should not erase saved highlights.

## Main Review Surface

The new center panel should include:

- active context header,
- flagged period and count,
- validation explanation,
- recommended action,
- current/previous/optional published table,
- descriptor,
- formula,
- desk series,
- line chart,
- issues report history,
- related indicators table.

## Current / Previous / Published

Every indicator has current and previous values.

Published values may be absent.

Rules:

- current and previous show by default,
- published is optional and should live in a chart/table options menu,
- missing published state should be quiet and clear.

## Related Indicators

Related indicators depend only on selected indicator.

They are not filtered by:

- sector,
- severity,
- validation.

`Updated` and `Added` are legend semantics, not filters.

## Frontend Enhancements

The new UI should improve:

- expand/collapse behavior,
- search,
- keyboard traversal,
- visible visited/kept/edited state,
- table scrolling,
- flagged point highlighting,
- manual evidence highlighting,
- chart options,
- evidence selection.

## Filter Scope Summary

| Selection | Affects | Does not affect |
| --- | --- | --- |
| Country/submission | all review data | none |
| Sector | validation list, indicator list, active context | submission status, related indicator definition |
| Severity | validation list | chart, table, related indicators |
| Validation | indicator list, flagged periods, explanation | related indicators |
| Indicator | chart, table, metadata, related indicators | validation list |
| Time period | displayed chart/table range | flagged point definition |
| Evidence range | saved highlight/export range | displayed data range |
| Updated/Added legend | related indicator color meaning | data filters |

## Open Questions For Real Data Mapping

- Where does validation explanation come from?
- Is recommended action provided with validation explanation?
- Where do related indicators come from?
- Which field drives updated/added color meaning?
- Should evidence range include context periods around flagged periods?
- Should published series be available for all charts or only specific validations?
- Should current/previous/published tables show differences or percent changes?
- Should users add free-form notes per selected pair?
