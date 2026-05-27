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
- green `Keep` action,
- yellow `Edit` action,
- white `Skip` action,
- draft error state.

## Exclude

- indicator id/name display in the right panel,
- recommended action display in the right panel,
- flagged period display in the right panel,
- real AI API,
- API keys,
- evidence display,
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
- Draft does not enter final output unless kept or edited.
- `Keep` sets status to `kept`.
- Editing or pressing `Edit` sets status to `edited`.
- `Skip` leaves the draft unkept/unedited and does not create a persistent skip state.
- Unkept and unedited drafts are ignored.
- Removing kept/edited content happens later in overall edit.

## Acceptance

- Active pair change shows that pair's issue-report explanation and draft.
- Keep updates navigation marker.
- Edit updates navigation marker.
- Skip does not mark the item as kept or edited.
- Kept and edited markers remain distinct.
- Draft error does not block review.
