# Navigation Components

## Owns

`ReviewNavigator`, `SectorList`, `ValidationList`, and `IndicatorList`.

## Related Slices

- `02_left_navigation`
- `04_review_state_flow`

## Rules To Preserve

- Navigation hierarchy is `sector -> validation -> indicator`.
- Severity is shown as marker metadata on validation rows.
- Indicator is single-select.
- Keyboard traversal moves through visible sectors, validations, and indicators with Arrow Up/Down.
- Related indicators are not filtered by sector, severity, or validation.
