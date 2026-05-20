# State Module

## Owns

Frontend review session state, selectors, and state transitions.

## Related Slices

- `04_review_state_flow`
- `05_active_draft_panel`
- `06_complete_overall_edit`
- `07_evidence_highlighting`

## Rules To Preserve

- Pair becomes visited only after review surface load success.
- Draft state is keyed by `review_item_id`.
- Evidence state is keyed by `review_item_id`.
- Visited / kept / edited state should persist locally by session id until real backend persistence exists.
- Avoid backend or AI implementation details in state.
