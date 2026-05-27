# Frontend Build Plan

## Purpose

This is the concise implementation sequence for the next frontend phase.

Use it with:

- [frontend_developer_brief.md](frontend_developer_brief.md)
- [frontend_code_organization.md](frontend_code_organization.md)
- [mock_data_spec.md](mock_data_spec.md)

Detailed slice notes live in [reference/frontend_development_slices/](reference/frontend_development_slices/).

## Global Rules

- Frontend and interaction only for now.
- Use mock data and mock services.
- No real backend.
- No real AI API.
- No real file export.
- No Outlook / SharePoint integration.
- No Electron / Tauri packaging yet.
- Right panel shows only the current active pair.
- Complete requires all flagged pairs visited.

## Build Sequence

| Milestone | Build | Must Include | Do Not Include | Done When |
| --- | --- | --- | --- | --- |
| 0 | Scaffold | React + Vite + TypeScript structure, folders from code organization | Business UI | Empty app runs on unrestricted machine |
| 1 | UI Shell | Three-column layout, compact SessionHeader, switchable WEO/MCD REO brand block, searchable country selector, Other Settings placeholder, header decimal/font controls, design tokens, left/right resize handles | Real navigation/chart/data | Layout works at laptop, half-ultrawide, ultrawide widths |
| 2 | Left Navigation | Sector, severity, validation, indicator lists; keyboard traversal; visited and raised-issue markers | ReviewSurface visited logic | User can keyboard-traverse first to last flagged pair |
| 3 | Center Review Surface | Top data table, chart title, formula inside chart, line chart, related indicators table and empty state | Saved highlights/export, right-panel desk explanation | Mock pair displays enough center data context for review |
| 4 | Review State Flow | Zustand store, active pair, visited ids, kept ids, edited ids, local persistence, next unvisited | Real backend persistence | Reload restores visited/raised-issue state for same mock session |
| 5 | Active Draft Panel | Desk explanation from issues report, mock draft, keep, edit, skip, error state | Real AI | Keep/edit update the raised-issue marker; skip does not create a final state |
| 6 | Complete / Overall Edit | Complete gate, no-issue completion, sector grouping, indicator merge, mock output | Real Outlook/file export | All-visited/no-issue and all-visited/with-issues paths both work |
| 7 | Evidence / Highlighting | Evidence toggles, saved highlights, multiple chart intervals, add/remove highlight mode | Real evidence export | Saved highlights restore per pair |
| 8 | Integration Readiness | Service interfaces, mock adapters, loading/error cleanup | Real HTTP implementation | Mock services can later be swapped without rewriting components |

## Milestone 3 Details

Center Review Surface must include:

- `ReviewSurface`
- `CurrentPreviousPublishedTable`
- `SeriesChart`
- `RelatedIndicatorsTable`

Important requirements:

- table default horizontal scroll opens on newest/rightmost period.
- chart has x-axis range/data zoom through the explicit chart slider only.
- ordinary mouse-wheel or vertical trackpad scrolling over the chart must not zoom the chart.
- y-axis auto-scales to visible range; additional range-padding refinement can wait until a later chart pass.
- formula appears inside the chart container.
- desk series appears on the chart title row.
- related indicators filter by indicator only.

## Milestone 4 Details

Persist locally until real backend persistence exists:

- active review item id.
- visited review item ids.
- kept review item ids.
- edited review item ids.
- navigation may display kept and edited as one raised-issue marker even though state stores them separately.
- draft snippets.
- evidence selections.
- saved highlights.

Use browser storage scoped by session id.

## Stop Conditions

Pause and clarify if:

- implementation requires real WEO data mapping.
- a component starts embedding backend or AI logic.
- UI behavior conflicts with [frontend_developer_brief.md](frontend_developer_brief.md).
- a milestone becomes too large to manually verify.
- target layouts break.

## First Work Package

Start with:

1. Milestone 0.
2. Milestone 1.
3. Milestone 2.

Do not begin real AI or backend work before Milestone 4 is stable.
