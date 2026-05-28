# Frontend Development Slices

## Purpose

This folder splits frontend work into small implementation slices. Slices define build order and acceptance boundaries. Production code should still be organized by product module, not by slice.

Current scope:

- UI layout,
- navigation,
- review surface,
- frontend state,
- evidence selection and highlighting,
- active draft panel,
- complete and overall edit flow.

Current scope excludes:

- real backend ingestion,
- real Flask API implementation,
- real AI API,
- real file export,
- Outlook or SharePoint integration,
- Electron or Tauri packaging.

Use mock data, mock draft text, and mock export results.

## Shared Product Rules

- Minimum review unit is `sector + validation + indicator`.
- AI does not select issues.
- Pair becomes `visited` only after `ReviewSurface` loads successfully.
- Right panel shows only the active pair draft.
- Drafts do not enter final output by default.
- `Raise` captures the current editable draft text for later output/API submission.
- Unkept and unedited drafts are ignored.
- `Complete` requires all flagged pairs to be visited.
- No kept/edited snippets means no email generated.
- Kept/edited snippets go to overall edit or mock output.
- Evidence content is rendered in the center panel, while compact evidence inclusion choices can sit beside the right-panel Raise action.
- Related indicators depend only on indicator.

## Suggested Order

1. `01_ui_shell.md`
2. `02_left_navigation.md`
3. `03_center_review_surface.md`
4. `04_review_state_flow.md`
5. `05_active_draft_panel.md`
6. `06_complete_overall_edit.md`
7. `07_evidence_highlighting.md`
8. `08_integration_readiness.md`

Prioritize slices 01-04 first. They establish the core review loop.

## Definition Of Done For Any Slice

- Uses mock data.
- Does not introduce real backend or AI dependencies.
- Does not hard-code local file paths.
- Preserves shared state names.
- Does not break the three-column layout.
- Has empty/loading/error or placeholder behavior.
- Does not conflict with `../frontend_interaction_spec.md`.
