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
- Validation names should not repeat the severity word when the colored severity label is already shown.
- Indicator rows should display indicator code, such as `NGDP_R`, instead of long indicator display names.
- Visited rows are shown with quieter gray text.
- Kept and edited rows are marked on the right side of the indicator row with compact symbols, not with left-side A/V/K/Q-style codes.
- Rows wrap text when the left panel is too narrow instead of truncating with ellipsis.
- Sector and validation/diagnostic rows use visible hierarchy formatting such as indentation, connector lines, and disclosure controls.
- `Collapse all` is disabled when all sector and validation/diagnostic rows are collapsed.
- `Expand all` is disabled when all sector and validation/diagnostic rows are expanded.
- Indicator is single-select.
- Related indicators are not controlled here.
- The navigation panel scrolls internally after it reaches the available viewport height.
- Down Arrow moves focus to the next visible row in the hierarchy.
- Up Arrow moves focus to the previous visible row in the hierarchy.
- Keyboard traversal moves from indicators to the next validation and next sector without requiring the mouse.
- After mouse activation of a row, Arrow Down/Up uses the navigation traversal behavior and must not scroll the page.

## Acceptance

- User can activate a mock review item.
- User can manually resize the left panel width.
- Quarterly sectors appear only for quarterly session.
- Kept and edited markers are visually distinct.
- Navigation can emit `activeReviewItemId`.
- Navigation does not mark a pair visited by itself.
- User can move through visible sector, validation, and indicator rows with the keyboard Down Arrow.
