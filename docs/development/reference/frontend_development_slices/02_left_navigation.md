# Slice 02: Left Navigation

## Goal

Build hierarchical sector, validation, and indicator navigation using mock `ReviewItem[]`.

## Include

- fixed sector list,
- conditional quarterly sectors,
- nested validation list under each sector,
- nested indicator list under each validation,
- user-resizable left panel width,
- configurable minimum and maximum bounds for user-resized left panel width,
- active state,
- hover state,
- collapsible/expandable sector rows,
- collapsible/expandable validation/diagnostic rows,
- sticky bottom controls for `Collapse all` and `Expand all`,
- visited/kept/edited visual placeholders,
- keyboard traversal with arrow keys.

## Exclude

- marking visited from review surface load,
- real data mapping,
- draft behavior.

## Rules

- Hierarchy is `sector -> validation -> indicator`.
- Severity is shown as metadata or a marker on validation/indicator rows, not as a required hierarchy level.
- Validation severity appears as a colored rounded label: Critical red, High orange, Low yellow.
- Validation rows should display the validation id, such as `REVISION_30PCT`, instead of the long validation display name.
- Indicator rows should display indicator code, such as `NGDP_R`, instead of long indicator display names.
- Indicator active/focus treatment should stay inside the row bounds and must not overlap adjacent rows or status circles.
- Visited rows are shown with quieter gray text.
- Indicator visit/raise state is marked at the far right of every indicator row with a small status circle: unvisited is hollow, visited without raised issue is solid green, and visited with a kept/edited raised issue is solid yellow.
- The right-side status circle uses a fixed-width column so wrapped indicator text never overlaps it as the left panel is resized.
- Rows wrap text when the left panel is too narrow instead of truncating with ellipsis.
- Sector and validation/diagnostic rows use visible hierarchy formatting such as modest indentation, font size/weight, and modern single-line SVG chevrons.
- Row content should stay vertically centered even when labels wrap.
- Severity labels should size to their text with compact horizontal padding instead of sharing a fixed width.
- The left panel resize maximum should stay modest and must not exceed one third of the viewport width on desktop layouts.
- The resize handle between the left navigation and center surface should be visually narrow so it does not waste horizontal workspace.
- `Collapse all` is disabled when all sector and validation/diagnostic rows are collapsed.
- `Expand all` is disabled when all sector and validation/diagnostic rows are expanded.
- Indicator is single-select.
- Related indicators are not controlled here.
- The navigation panel scrolls internally after it reaches the available viewport height.
- Down Arrow moves focus to the next visible indicator review item.
- Up Arrow moves focus to the previous visible indicator review item.
- Each non-repeated ArrowDown/ArrowUp key press moves by exactly one indicator review item; held-key repeat events must not skip additional items or trigger default scrolling.
- Keyboard traversal always makes the target indicator the active review item so the center and right panels update together.
- Keyboard traversal should only scroll the navigation panel when the target indicator is outside the visible area; moving to an already visible indicator must not change scroll position.
- After mouse activation of a row, Arrow Down/Up uses the navigation traversal behavior and must not scroll the page.

## Known Follow-Up

- Edge keyboard traversal behaves correctly after scroll locking. Safari still shows residual navigation-panel scrolling in some local testing; keep this as a browser-specific follow-up rather than blocking the current slice.

## Acceptance

- User can activate a mock review item.
- User can manually resize the left panel width.
- Quarterly sectors appear only for quarterly session.
- Kept and edited markers are visually distinct.
- Navigation can emit `activeReviewItemId`.
- Navigation does not mark a pair visited by itself.
- User can move through visible sector, validation, and indicator rows with the keyboard Down Arrow.
