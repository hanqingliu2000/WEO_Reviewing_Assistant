# Navigation Components

## Owns

`ReviewNavigator`, `SectorList`, `SeverityFilter`, `ValidationList`, and `IndicatorList`.

## Related Slices

- `02_left_navigation`
- `04_review_state_flow`

## Rules To Preserve

- Navigation hierarchy is `sector -> severity -> validation -> indicator`.
- Severity only filters validation list.
- Indicator is single-select.
- Keyboard traversal moves through indicators, validations, then sectors.
- Related indicators are not filtered by sector, severity, or validation.
