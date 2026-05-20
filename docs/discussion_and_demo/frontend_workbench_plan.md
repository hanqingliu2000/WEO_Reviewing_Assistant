# Frontend Workbench Plan

## Purpose And Audience

This document is both a design brief and a module-level planning note for the local review workbench.

Audience:

- project owner,
- demo stakeholders,
- future developer/designer.

Design goal:

```text
professional, dense, calm data workbench
```

Do not build a landing page or an AI showcase. The first screen should be the actual review tool.

## Core UX Direction

The workbench has three columns:

```text
Left Navigation | Center Review Surface | Right Active Draft Panel
```

The goal is not to clone every existing report feature. The target is:

```text
core review workflow recreation + usability enhancement
```

The main demo value is a smoother flow from filtering, to reviewing evidence, to keeping or editing draft language.

## First-Screen Wireframe

### Left Column

Contains:

- session/country controls,
- sector list,
- severity filter,
- validation list,
- indicator list,
- counts and status badges,
- search/filter controls,
- next-unvisited action.

Rules:

- sector list is fixed,
- quarterly sectors appear only for quarterly sessions,
- severity filters validation list only,
- indicator is single-select,
- kept and edited markers are distinct.

### Center Column

Contains:

- active context header,
- flagged period/count,
- validation explanation,
- recommended action,
- line chart,
- current/previous/optional published table,
- issues report history,
- related indicators table,
- metadata accordion,
- time period control,
- evidence/highlight controls.

Rules:

- related indicators depend only on indicator,
- issues report depends on validation + indicator,
- time period controls display range,
- evidence range is separate,
- tables default-scroll to newest/rightmost period.

### Right Column

Contains:

- active draft for current pair,
- draft status,
- editable text,
- keep action,
- regenerate action,
- restore original action,
- complete control.

Rules:

- do not list all kept pairs,
- do not manage evidence here,
- final removal happens in overall edit.

## Interaction Flow

1. User opens local workbench.
2. User selects country/session.
3. Left navigation loads sector, severity, validation, and indicator hierarchy.
4. User activates a `sector + validation + indicator` pair.
5. Center surface loads evidence and marks the pair visited.
6. Right panel shows or generates a mock draft for the active pair.
7. User keeps the draft, edits it, or does nothing.
8. User repeats until all flagged pairs are visited.
9. User clicks `Complete`.
10. If no snippets are kept/edited, review completes with no email.
11. If snippets are kept/edited, system groups by sector and merges by indicator.
12. User reviews final grouped output in overall edit or mock output flow.

## Evidence And Highlighting

Evidence is managed in the center panel.

Defaults:

- line chart included,
- current data table off,
- related indicators table off.

Highlight support:

- chart point,
- chart interval,
- table cell,
- table row,
- table column,
- related indicator row/value.

Nice-to-have:

- left-drag adds chart highlight interval,
- right-drag removes or shrinks highlight interval,
- toolbar modes if right-drag is not feasible.

Switching pairs clears unsaved temporary highlights. Saved highlights restore with the pair.

## Conceptual Interfaces

### `ReviewItem`

Selectable `sector + validation + indicator` review unit.

### `ReviewItemDetail`

Detailed context for the center review surface.

### `DraftSnippet`

Editable draft text for one selected pair.

Statuses:

- `empty`,
- `generating`,
- `draft`,
- `kept`,
- `edited`,
- `error`.

### `EvidenceSelection`

Per-pair evidence settings and saved highlights.

### `ReviewSession`

Tracks active pair, visited pairs, draft state, evidence state, and completion readiness.

### `EmailDraftOutput`

Generated after completion. Groups snippets by sector and merges multiple validations under the same indicator.

## Module-Level Tasks

### Data Loading And Session Setup

- Load mock session.
- Normalize mock data into review items.
- Support country/session placeholder.

### Navigation And Filtering

- Build sector/validation/indicator hierarchy.
- Add severity filter.
- Add search if useful.
- Add active, visited, kept, edited markers.
- Add keyboard traversal.

### Review Surface

- Render chart, table, issues history, related indicators, metadata.
- Add time period control.
- Add table rightmost-period default scroll.

### Review State

- Track active pair.
- Mark visited on review surface load success.
- Persist visited/kept/edited state locally.

### Draft Workspace

- Use mock draft service.
- Support keep, edit, regenerate, error state.
- Do not list all kept pairs.

### Completion

- Gate on all pairs visited.
- Support no-issue completion.
- Group kept/edited snippets by sector and indicator.
- Open overall edit or mock output.

### Integration Readiness

- Keep service boundary clean.
- Avoid hard-coded local paths.
- Keep future Flask integration possible.

## Acceptance Criteria

- AI does not select issues.
- First screen is a three-column review workbench.
- Reviewer can traverse all flagged pairs.
- Visit state is visible and recoverable.
- Kept and edited markers are distinct.
- Center panel provides enough evidence to decide.
- Right panel handles only the active draft.
- Complete/no-issue/with-issue flows are clear.
- Future Flask and desktop wrapper paths remain open.

## Assumptions

- First implementation uses mock data.
- First real backend layer is likely Flask.
- Current implementation is frontend-only.
- Desktop packaging is not part of the current phase.
