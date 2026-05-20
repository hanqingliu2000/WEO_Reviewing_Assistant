# Services Module

## Owns

Mock service boundary for future backend, AI, and export integration.

## Related Slices

- `05_active_draft_panel`
- `06_complete_overall_edit`
- `08_integration_readiness`

## Rules To Preserve

- Components call service functions, not raw mock files.
- No API keys.
- No real OpenAI calls in current scope.
- No hard-coded local paths.
