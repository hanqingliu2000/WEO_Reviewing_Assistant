# UI Component Inventory

## Purpose

This document lists the main frontend components for the local-first review workbench. It defines ownership, inputs, events, states, and acceptance expectations at module level.

The UI should be a professional, dense, calm data review tool. It should not feel like a marketing page or an AI demo.

## Layout Overview

```text
Left Review Navigator | Center Review Surface | Right Active Draft Panel
```

The right panel shows only the current active pair's desk explanation and draft. Full final editing happens in `OverallEditScreen`.

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

- switchable report identity brand block,
- searchable country selector,
- decimal-place controls,
- font-size controls.

Rules:

- report identity supports WEO and MCD REO mock brand blocks,
- report identity dropdown options match the displayed brand block width, content, and style,
- country search filters by country code or country name,
- current country switching is UI-only in the mock phase,
- header does not show reviewer name or submission timestamp,
- font-size controls support the default size plus up to four larger steps,
- increased font size should preserve outer panel bounds and rely on internal scrolling/wrapping/truncation.

## Navigation Components

### `ReviewNavigator`

Owns:

- sector list,
- severity filter,
- validation list,
- indicator list,
- visited/raised-issue progress display,
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

- hierarchy is `sector -> validation -> indicator`,
- severity is displayed as validation metadata and does not need to be a separate hierarchy level,
- indicator is single-select,
- active/visited/raised-issue states are visible,
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
- kept and edited both show as the same raised-issue marker at the far right of the indicator row.

## Review Surface Components

### `ReviewSurface`

Owns:

- active review layout,
- load success event that marks a pair visited,
- center table/chart/related-indicators composition.

Inputs:

- active `ReviewItem`,
- `ReviewItemDetail`,
- decimal-place display setting,
- evidence state.

Events:

- review item loaded,
- highlight changed,
- evidence option changed.

### `ChartTitleRow`

Owns:

- indicator code,
- indicator name,
- desk series.

Rules:

- indicator code and name appear above the line chart,
- desk series aligns to the right of the same row.

### `LineChartPanel`

Owns:

- current and previous series,
- optional published series,
- flagged markers,
- flagged period shading,
- user highlights,
- x-axis range/data zoom through the explicit chart slider,
- y-axis auto-scaling.

Rules:

- current and previous show by default,
- published displays directly when present,
- additional y-axis range-padding refinement can wait for a later chart pass,
- formula is displayed inside the chart container above the plot,
- ordinary mouse-wheel or vertical trackpad scrolling over the chart does not zoom the chart,
- multiple non-contiguous highlight intervals can coexist.

### `CurrentPreviousPublishedTable`

Owns:

- current/previous/optional published values.

Rules:

- default horizontal scroll starts at the newest/rightmost period,
- horizontal scrollbars do not overlap table content,
- missing published is handled cleanly,
- cell/row/column highlights are supported.

### `DeskExplanationPanel`

Owns:

- prior explanations or confirmations for the current validation + indicator pair.

Position:

- in the right panel above the draft box.

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
- shows a compact empty state when no related indicators exist.

### `MetadataAccordion`

Owns:

- descriptor,
- formula,
- desk series,
- source metadata,
- optional technical details.

Status:

- Deferred. Current center surface shows formula in the chart and desk series in the chart title row instead of using a metadata accordion.

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
- desk explanation above draft,
- mock draft generation,
- keep,
- edit,
- skip,
- error state.

Rules:

- draft does not enter final output by default,
- `Keep` makes it `kept`,
- editing makes it `edited`,
- `Skip` leaves it unkept/unedited,
- no persistent skip state,
- no evidence media is shown here.

### `DraftEditor`

Owns:

- editable text area,
- original text reference.

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
