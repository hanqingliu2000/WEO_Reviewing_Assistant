# UI Component Inventory

## Purpose

This document lists the main frontend components for the local-first review workbench. It defines ownership, inputs, events, states, and acceptance expectations at module level.

The UI should be a professional, dense, calm data review tool. It should not feel like a marketing page or an AI demo.

## Layout Overview

```text
Left Review Navigator | Center Review Surface | Right Active Draft Panel
```

The right panel shows only the current active pair draft. Full final editing happens in `OverallEditScreen`.

## Layout Components

### `AppShell`

Owns:

- three-column layout,
- global loading/error boundaries,
- top-level session and progress state,
- future Electron/Tauri compatibility constraints.

Inputs:

- `ReviewSession`,
- active `ReviewItem`,
- app loading/error state.

Events:

- session initialized,
- global error dismissed,
- density changed.

Acceptance:

- opens directly to the workbench,
- does not hard-code local file paths,
- uses mock services during current frontend phase.

### `SessionHeader`

Owns:

- country/session display,
- status placeholder,
- reviewer context.

Rules:

- sector changes do not affect the header status placeholder,
- placeholder is acceptable for the first version.

## Navigation Components

### `ReviewNavigator`

Owns:

- sector list,
- severity filter,
- validation list,
- indicator list,
- visited/kept/edited progress display,
- keyboard traversal.

Inputs:

- `ReviewItem[]`,
- active item id,
- visited ids,
- kept ids,
- edited ids,
- severity selection,
- search query.

Events:

- active pair changed,
- severity changed,
- search changed,
- next unvisited requested.

Acceptance:

- hierarchy is `sector -> severity -> validation -> indicator`,
- severity filters only validation list,
- indicator is single-select,
- active/visited/kept/edited states are visible,
- next-unvisited action exists.

### `SectorList`

Owns:

- fixed sector list,
- conditional quarterly sectors.

Rules:

- show `09 - Q-National Accounts` and `10 - Q-Price, Labor` only when `has_quarterly_data` is true,
- sector does not affect submission status,
- sector does not define related indicators.

### `SeverityFilter`

Owns:

- validation prefix grouping such as `Critical`, `High`, `Low`.

Rules:

- filters validation list only,
- does not change chart/table/related indicators directly.

### `ValidationList`

Owns:

- validations under active sector and severity.

Rules:

- validation affects indicator list, flagged periods, explanation, and draft context,
- validation does not affect related indicators.

### `IndicatorList`

Owns:

- flagged indicators under active sector and validation.

Rules:

- single-select only,
- visited state uses subtle background,
- kept and edited show distinct markers before indicator name.

## Review Surface Components

### `ReviewSurface`

Owns:

- active review layout,
- load success event that marks a pair visited,
- chart/table/issues/metadata composition.

Inputs:

- active `ReviewItem`,
- `ReviewItemDetail`,
- display range,
- evidence state.

Events:

- review item loaded,
- display range changed,
- highlight changed,
- evidence option changed.

### `ActiveContextHeader`

Owns:

- country, sector, validation, indicator summary,
- flagged period/count chips.

### `TimePeriodControl`

Owns:

- display range for chart and tables.

Rules:

- display range is not the same as evidence range,
- changing display range does not delete saved highlights.

### `LineChartPanel`

Owns:

- current and previous series,
- optional published series,
- flagged markers,
- flagged period shading,
- user highlights,
- x-axis range/data zoom,
- y-axis auto-scaling.

Rules:

- current and previous show by default,
- published is available in options menu when present,
- multiple non-contiguous highlight intervals can coexist.

### `CurrentPreviousPublishedTable`

Owns:

- current/previous/optional published values.

Rules:

- default horizontal scroll starts at the newest/rightmost period,
- missing published is handled cleanly,
- cell/row/column highlights are supported.

### `IssuesReportPanel`

Owns:

- prior explanations or confirmations for the current validation + indicator pair.

Position:

- between line chart and related indicators.

Rules:

- filter by validation + indicator,
- show time period and explanation,
- long text is clamped, expandable, or shown in popover,
- compact empty state.

### `RelatedIndicatorsTable`

Owns:

- related indicator rows for the active indicator.

Rules:

- depends only on indicator,
- not filtered by sector, severity, or validation,
- updated/added display is a legend, not a filter.

### `MetadataAccordion`

Owns:

- descriptor,
- formula,
- desk series,
- source metadata,
- optional technical details.

## Evidence Components

### `EvidenceToolbar`

Owns:

- line chart evidence toggle,
- current data table evidence toggle,
- related indicators evidence toggle,
- save highlight action,
- clear temporary highlights action.

Defaults:

- line chart on,
- current data table off,
- related indicators table off.

### `HighlightModeToggle`

Owns:

- add highlight mode,
- remove highlight mode,
- neutral selection mode.

Use toolbar modes if right-drag is not feasible.

## Draft Components

### `ActiveDraftPanel`

Owns:

- current active pair draft only,
- mock draft generation,
- keep,
- edit,
- regenerate,
- error state.

Rules:

- draft does not enter final output by default,
- `Keep` makes it `kept`,
- editing makes it `edited`,
- no persistent skip state,
- no evidence media is shown here.

### `DraftEditor`

Owns:

- editable text area,
- original text reference,
- restore original action.

## Completion Components

### `CompleteReviewControl`

Owns:

- completion gate,
- visited count,
- kept/edited count,
- next-unvisited action.

Rules:

- all flagged pairs must be visited,
- no kept/edited snippets means review complete with no email,
- kept/edited snippets lead to overall edit or mock output.

### `OverallEditScreen`

Owns:

- sector grouping,
- indicator-level merging,
- final deletion/reordering,
- mock output preview.

Rules:

- only kept/edited snippets enter,
- multiple validations under the same indicator are merged,
- final removal happens here, not in the active draft panel.

## Shared Components

- `StatusBadge`
- `CountPill`
- `IconButtonWithTooltip`
- `EmptyState`
- `ErrorBanner`

Shared components must remain generic and should not own product state.

## Frontend / Backend Boundary

Current phase:

- mock data,
- mock services,
- mock draft generation,
- mock export result.

Future phase:

- Flask or another local Python API can replace the mock service adapter.

Rules:

- components should depend on structured objects,
- no component should hard-code local file paths,
- no API keys in frontend code,
- backend details stay behind services.
