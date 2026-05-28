# Slice 04: Review State Flow

## Goal

Connect navigation and review surface through frontend session state.

## Include

- active review item id,
- visited item ids,
- kept item ids placeholder,
- edited item ids placeholder,
- draft snippets placeholder,
- evidence selections placeholder,
- next-unvisited action,
- local browser persistence.

## Exclude

- real backend persistence,
- real AI,
- final email generation.

## Rules

- A pair becomes `visited` only when `ReviewSurface` loads successfully.
- Clicking or focusing a row is not enough if the center load fails.
- Keyboard focus movement through the left hierarchy does not by itself mark a pair visited.
- Keyboard traversal updates the active review item so center and right panels change together.
- `Raise` means the current draft text should be included for later output/API submission.
- Evidence inclusion choices are captured with the raised draft payload and reset to defaults on active item change.
- `Complete` requires all flagged pairs visited.
- No persistent skip state.

## Acceptance

- User can navigate through all mock flagged pairs.
- Visited count increases after surface load success.
- Raised items can be represented in navigation with the shared raised-issue marker.
- No action on a draft creates no final state.
- State survives reload in the same browser/profile.
- Next-unvisited goes to the correct next pair.
- Complete becomes available only after all flagged pairs are visited.
