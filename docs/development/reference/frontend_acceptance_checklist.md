# Frontend Acceptance Checklist

## Purpose

Use this checklist after each frontend implementation slice. It is a manual acceptance list first; later it can be converted into automated tests.

## Scope Assumptions

- Mock data is allowed.
- Mock draft generation is allowed.
- Mock export state is allowed.
- No real backend is required.
- No real AI API is required.
- No API key is required.

## Layout

- The first screen is the three-column workbench.
- No landing page appears before the workbench.
- Left, center, and right panels do not overlap.
- The center review surface gets the most space.
- The UI works on laptop fullscreen, ultrawide fullscreen, and half-ultrawide window.
- Text remains readable at small/default/large font settings.
- No visible text is smaller than 11px.

## Navigation

- Hierarchy is `sector -> severity -> validation -> indicator`.
- Sector list is fixed.
- Quarterly sectors appear only when the session has quarterly data.
- Severity filters only the validation list.
- Indicator is single-select.
- Indicator list only shows items with flags for the active sector and validation.
- Keyboard traversal can move from first flagged pair to last flagged pair.
- Indicator traversal continues into the next validation and then next sector.

## State

- Pair becomes visited only after the review surface loads successfully.
- Active, visited, kept, and edited states are visually distinct.
- Kept and edited markers are distinguishable.
- Visited/kept/edited state can be restored after browser reload in the same mock session.
- No persistent skip state exists.

## Center Review Surface

- Active context is visible.
- Flagged period and flagged data point count are visible.
- Validation explanation is visible.
- Recommended action is visible.
- Line chart renders current and previous series.
- Published series is optional and hidden behind an options menu.
- Current/previous/published table renders when data exists.
- Tables default-scroll to the newest/rightmost period.
- Issues report panel appears between chart and related indicators.
- Issues report filters by validation + indicator.
- Long issues report text is controlled with clamp, expand, or popover behavior.
- Related indicators depend only on indicator.
- Related indicators are not affected by sector, severity, or validation.
- Related indicators empty state is handled.

## Chart And Highlighting

- Flagged points are visible.
- Flagged periods are visible.
- x-axis range/data zoom works.
- y-axis auto-scales to visible data with padding.
- Multiple non-contiguous chart highlight intervals can coexist.
- Left-drag add and right-drag remove are implemented if feasible.
- If right-drag is not feasible, equivalent toolbar modes exist.
- Unsaved temporary highlights clear on pair switch.
- Saved highlights restore when returning to a pair.

## Draft Panel

- Right panel shows only the current active pair.
- Draft can be generated from mock service.
- Draft status starts as `draft` and does not enter final output by default.
- Keep marks the draft as `kept`.
- Editing marks the draft as `edited`.
- Regenerate handles edited text carefully.
- Draft errors do not block review.
- No evidence media is displayed in the draft panel.

## Completion

- Complete is blocked or disabled while unvisited pairs remain.
- UI can jump to the next unvisited pair.
- If all pairs are visited and no kept/edited snippets exist, review completes with no email generated.
- If kept/edited snippets exist, the app opens overall edit or mock output flow.
- Overall edit groups by sector and merges multiple validations under the same indicator.

## Evidence

- Line chart evidence is selected by default.
- Current data table evidence is off by default.
- Related indicators evidence is off by default.
- Mock export preview reflects selected evidence.
- Export-related UI preserves saved highlights.

## No Sensitive Content

- No real country names.
- No real WEO data.
- No source report media.
- No internal paths.
- No API keys.
