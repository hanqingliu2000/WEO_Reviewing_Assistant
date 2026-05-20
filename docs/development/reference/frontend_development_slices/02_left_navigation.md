# Slice 02: Left Navigation

## Goal

Build sector, severity, validation, and indicator navigation using mock `ReviewItem[]`.

## Include

- fixed sector list,
- conditional quarterly sectors,
- severity filter,
- validation list,
- indicator list,
- active state,
- hover state,
- visited/kept/edited visual placeholders,
- keyboard traversal.

## Exclude

- marking visited from review surface load,
- real data mapping,
- draft behavior.

## Rules

- Hierarchy is `sector -> severity -> validation -> indicator`.
- Severity filters validation list only.
- Indicator is single-select.
- Related indicators are not controlled here.
- Keyboard traversal moves from indicators to next validation and next sector.

## Acceptance

- User can activate a mock review item.
- Quarterly sectors appear only for quarterly session.
- Kept and edited markers are visually distinct.
- Navigation can emit `activeReviewItemId`.
- Navigation does not mark a pair visited by itself.
