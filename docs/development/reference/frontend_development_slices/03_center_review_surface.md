# Slice 03: Center Review Surface

## Goal

Render the center review surface for one active mock review item.

## Include

- active context header,
- flagged period/count,
- validation explanation,
- recommended action,
- line chart placeholder or ECharts mock chart,
- current/previous/optional published table,
- issues report panel,
- related indicators table,
- metadata accordion,
- time period control.

## Exclude

- saved highlight state,
- real export,
- real backend data.

## Rules

- Current and previous series show by default.
- Published is optional and should be in an options menu.
- Issues report filters by validation + indicator.
- Related indicators filter by indicator only.
- Table horizontal scroll should start at newest/rightmost period.

## Acceptance

- Mock item renders enough context for review.
- Same indicator under multiple validations shares chart/table series.
- Explanation and flagged periods can differ by validation.
- Missing published data is handled cleanly.
- Empty related indicators state is handled.
