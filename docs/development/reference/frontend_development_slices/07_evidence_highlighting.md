# Slice 07: Evidence And Highlighting

## Goal

Add pure-frontend period highlighting for evidence selection in the center review surface.

This slice implements synchronized temporary highlighting only. It does not save
highlights, export screenshots, or call the backend yet, but it must keep a
backend-ready payload shape available for the next integration step.

## Include

- evidence toggles,
- line chart default evidence,
- current data table optional evidence,
- related indicators optional evidence,
- default highlights from flagged periods,
- temporary period highlights,
- synchronized chart/table highlights,
- session-scoped highlight memory,
- chart range hover handles,
- backend-ready highlight payload.

## Exclude

- real evidence export,
- browser automation,
- email attachments.
- backend persisted highlight save/load,
- screenshot capture,
- export preview.

## Rules

- Evidence content is rendered in the center panel.
- Evidence inclusion choices can be exposed beside the right-panel `Raise` action as compact checkboxes, but the right panel does not display evidence media.
- Line chart is included by default.
- Current data table is off by default.
- Related indicators table is off by default.
- The chart evidence target includes the indicator code/title, indicator name/subtitle, desk series, formula, and chart as one component-level capture region.
- Switching active review item resets evidence inclusion choices to their defaults.
- Switching active review item preserves any user-modified highlight state for the prior item in the current browser session.
- Opening an item with no session highlight state initializes its highlights from that item's `flagged_periods`.
- Chart and both tables share one period-level highlight set.
- Highlights are period-based only; they do not distinguish current/previous/published series or related-indicator rows.
- Default flagged highlights and user-modified highlights use the same visual treatment.
- Adjacent highlighted periods in the chart render as one continuous translucent region.
- Chart highlight fill should stay subtle and more transparent than table cell highlighting.
- Line chart left-drag adds all periods covered by the drag range.
- Line chart right-drag removes all periods covered by the drag range.
- Clicking one chart period toggles that period in or out of the shared highlight set.
- Hovering a chart highlight region shows small range handles at the two ends of that continuous region; the handles are hidden when the region is not hovered.
- Dragging a chart range handle previews the new range live; the handle and translucent region move during drag before the state is committed on pointer release.
- The chart bottom slider keeps its range handles but does not show the data trend shadow.
- The chart region suppresses the browser context menu while right-drag remove is active.
- Main table and related indicators table allow clicking a period header or data cell to toggle that period. `Ctrl+click` remains supported.
- Table period highlighting applies only to data cells, not to the period header/year row.
- Adjacent highlighted table cells should read as one continuous fill, without per-cell inset borders or unfilled padding gaps inside each selected cell.
- Right-panel evidence checkboxes should favor one-line display and avoid extra enclosing borders.
- If a future browser has unresolved right-drag conflicts, use a toolbar fallback mode.

## Backend-ready payload

The frontend maintains a period payload that can be connected directly to a
future save/load endpoint:

```ts
type HighlightPeriodPayload = {
  review_item_id: string;
  highlighted_periods: string[];
  source: "default_flagged" | "user_modified";
  updated_at: string;
};
```

For v1, this payload stays in frontend session state and can be included in
local placeholder raise/export payloads. It is not submitted to an API.

Future backend behavior:

- Load saved `highlighted_periods` for a review item when available.
- Fall back to `flagged_periods` when there is no saved highlight payload.
- Save the current `highlighted_periods` when the reviewer raises, exports, or explicitly saves evidence.

## Acceptance

- Flagged periods are highlighted by default in the line chart, main table, and related indicators table.
- Adjacent chart highlights appear as a continuous translucent block.
- Hovering a chart highlight block shows two small draggable handles at the block edges.
- Dragging chart highlight handles moves the handle and preview region in real time.
- Left-dragging in the chart adds a period range and immediately syncs both tables.
- Right-dragging in the chart removes a period range and immediately syncs both tables.
- Clicking a chart period or table period toggles that period and immediately syncs all evidence views.
- Table headers remain unhighlighted when their period is selected.
- Adjacent highlighted table data cells appear as a continuous highlighter band.
- Switching active review item and returning preserves the user-modified highlight state for this browser session.
- The frontend exposes the backend-ready `HighlightPeriodPayload` shape without making a backend request.
- The chart bottom slider does not show the series trend shadow.
- Draft panel remains free of evidence media.
