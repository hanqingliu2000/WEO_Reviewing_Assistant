# Mock Data Module

## Owns

Frontend-only mock data used before real data mapping exists.

## Related Slices

- `02_left_navigation`
- `03_center_review_surface`
- `04_review_state_flow`
- `08_integration_readiness`

## Rules To Preserve

- Mock data should cover annual, quarterly, repeated indicators, missing published, and missing related indicators.
- Mock data is not the final data contract.
- Do not encode real confidential data here.

## Current Files

- `mockReviewData.ts` contains fully fictional sessions, review items, time series, issues report entries, draft snippets, and evidence selections.
- All country names, identifiers, values, and explanations are synthetic and should remain synthetic.
