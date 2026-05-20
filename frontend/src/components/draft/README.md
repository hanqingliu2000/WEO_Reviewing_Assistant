# Draft Components

## Owns

Right-side active draft panel and draft editor.

## Related Slices

- `05_active_draft_panel`
- `06_complete_overall_edit`

## Rules To Preserve

- Right panel shows only the current active pair.
- Drafts do not enter final output by default.
- `Keep` preserves AI original text.
- Editing changes status to `edited`.
- Do not introduce persistent skip state.
- Do not show exported evidence media in draft panel.
