# Slice 05: Active Draft Panel

## Goal

Build the right-side draft panel for the current active pair using mock draft text.

## Include

- mock draft generation,
- draft status,
- editable draft text,
- keep action,
- regenerate action,
- restore original action,
- draft error state.

## Exclude

- real AI API,
- API keys,
- evidence display,
- all-kept-pairs list,
- final email editor.

## Rules

- Right panel shows only current active pair.
- Draft default status is `draft`.
- Draft does not enter final output unless kept or edited.
- `Keep` sets status to `kept`.
- Editing sets status to `edited`.
- Unkept and unedited drafts are ignored.
- No explicit skip action.
- Removing kept/edited content happens later in overall edit.

## Acceptance

- Active pair change shows that pair's existing draft or generates a mock draft.
- Keep updates navigation marker.
- Edit updates navigation marker.
- Kept and edited markers remain distinct.
- Draft error does not block review.
