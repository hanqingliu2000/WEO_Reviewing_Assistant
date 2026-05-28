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
- backend-ready highlight payload.

## Exclude

- real evidence export,
- browser automation,
- email attachments.
- persisted highlight save/load,
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
- Switching active review item resets temporary highlights from that item's `flagged_periods`.
- Chart and both tables share one period-level highlight set.
- Highlights are period-based only; they do not distinguish current/previous/published series or related-indicator rows.
- Default flagged highlights and user-modified highlights use the same visual treatment.
- Line chart left-drag adds all periods covered by the drag range.
- Line chart right-drag removes all periods covered by the drag range.
- The chart region suppresses the browser context menu while right-drag remove is active.
- Main table and related indicators table use `Ctrl+click` on a period header or cell to toggle that period.
- Table period highlighting applies to the full visible period column, including the header and all visible rows.
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

For v1, this payload stays in frontend state and can be included in local
placeholder raise/export payloads. It is not submitted to an API.

Future backend behavior:

- Load saved `highlighted_periods` for a review item when available.
- Fall back to `flagged_periods` when there is no saved highlight payload.
- Save the current `highlighted_periods` when the reviewer raises, exports, or explicitly saves evidence.

## Acceptance

- Flagged periods are highlighted by default in the line chart, main table, and related indicators table.
- Left-dragging in the chart adds a period range and immediately syncs both tables.
- Right-dragging in the chart removes a period range and immediately syncs both tables.
- `Ctrl+click` in either table toggles a period and immediately syncs the chart and the other table.
- Switching active review item restores that item to its default flagged period highlights.
- The frontend exposes the backend-ready `HighlightPeriodPayload` shape without making a backend request.
- Draft panel remains free of evidence media.
