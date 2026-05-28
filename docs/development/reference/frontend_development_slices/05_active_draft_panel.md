# Slice 05: Active Draft Panel

## Goal

Build the right-side panel for the current active pair using mock issue-report explanation and mock draft text.

## Include

- user-resizable right panel width,
- `Desk Explanation` section above the draft,
- explanation text read from the active item's issues report entries,
- mock draft text box,
- draft status,
- editable draft text,
- yellow `Raise` action,
- `Ctrl+Enter` keyboard shortcut for `Raise`,
- evidence checkboxes for `Table`, `Chart`, and `Related indicators`,
- draft error state.

## Exclude

- indicator id/name display in the right panel,
- recommended action display in the right panel,
- flagged period display in the right panel,
- real AI API,
- API keys,
- full evidence display,
- all-kept-pairs list,
- final email editor.

## Rules

- Right panel shows only the current active pair.
- Right panel can be resized by dragging the separator between the center review surface and right panel.
- The right panel resize maximum should stay modest and must not exceed one third of the viewport width on desktop layouts.
- Desk explanation is sourced from `ReviewItemDetail.issue_report_entries`.
- Multiple issue-report entries can be shown as separate explanation snippets.
- If no issue-report entry exists, show a quiet empty state.
- Draft default status is `draft`.
- Draft text is editable, and `Raise` uses the current text at click/shortcut time.
- `Raise` is the only primary action in this panel for the current slice.
- `Raise` should pass the active review item id, current draft text, and selected evidence options to the future backend API. In the mock phase this can remain a local placeholder handler.
- `Ctrl+Enter` triggers the same raise handler as the `Raise` button.
- Evidence options are `Table`, `Chart`, and `Related indicators`; default is only `Chart` selected.
- Evidence options reset to their default state when the active review item changes.
- Removing raised content happens later in overall edit.

## Acceptance

- Active pair change shows that pair's issue-report explanation and draft.
- Raise can use either the default draft or user-edited draft text.
- Ctrl+Enter raises the current draft.
- Evidence checkboxes reset on active pair change.
- Draft error does not block review.
