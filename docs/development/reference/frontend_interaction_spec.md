# Frontend Interaction Spec

## Purpose

This document defines the core interaction rules for the local-first review workbench.

Core model:

- Users visit `sector + validation + indicator` pairs.
- A pair becomes `visited` only after the center review surface loads successfully.
- AI does not decide which issues should be raised.
- Draft text enters final output only after the user keeps or edits it.
- `Complete` requires all flagged pairs to be visited.
- If no snippets are kept or edited, the review can complete with no email generated.

## Review Unit

The smallest review unit is:

```text
sector + validation + indicator
```

This maps to `ReviewItem`. If one indicator is flagged by multiple validations, each validation/indicator combination is a separate `ReviewItem`. Final output later merges multiple validations under the same indicator.

## Responsibility Boundary

AI is responsible for:

- turning selected context into clear draft language,
- using only the current review item context,
- helping with wording.

Reviewer is responsible for:

- visiting each flagged pair,
- deciding whether to raise the issue,
- keeping or editing draft text,
- making final edits in the overall edit screen.

## Pair State

| State | Meaning | Set by |
| --- | --- | --- |
| `unvisited` | Pair has not loaded in the review surface | initial state |
| `visited` | Pair loaded successfully | review surface load success |
| `active` | Pair is currently shown | navigation |
| `kept` | User keeps AI original text | Keep action |
| `edited` | User edits draft text | text edit |

`kept` and `edited` both mean the item will be raised. The data model keeps them separate, but the left navigation can display both as the same raised-issue marker.

## Draft State

| State | Meaning |
| --- | --- |
| `empty` | No draft exists |
| `generating` | Mock draft service is running |
| `draft` | Draft exists but is not included in final output |
| `kept` | User kept AI original text |
| `edited` | User edited text |
| `error` | Draft generation failed |

There is no persistent `skip` state. Unkept and unedited drafts are ignored.

## Persistence

Session state should be saved locally enough that a user can recover after closing the browser.

Persist at minimum:

- active pair,
- visited item ids,
- draft snippets and statuses,
- evidence selections,
- saved highlights,
- display time range where practical.

Persistence should be scoped by country/submission/session id.

## Navigation Rules

Hierarchy:

```text
sector -> validation -> indicator
```

Rules:

- Sector is a fixed list.
- Quarterly sectors appear only when the current session has quarterly data.
- Severity comes from validation metadata and is displayed as a marker on validation rows; it is not a required hierarchy level.
- Indicator list shows only flagged indicators for the active sector and validation.
- Indicator is single-select.
- Related indicators depend only on selected indicator.

Keyboard behavior:

- `ArrowDown` moves through indicators.
- At the end of a validation, it moves to the first indicator of the next validation.
- At the end of a sector, it moves to the next sector.
- `ArrowUp` reverses the order.
- `Enter` or `Space` activates the focused pair.

## Filter Scope

| Selection | Affects | Does not affect |
| --- | --- | --- |
| Sector | validation list, indicator list | submission status, related indicator definition |
| Severity marker/filter, if present | validation list display only | chart, tables, related indicators, status |
| Validation | indicator list, flagged periods, explanation, draft context | related indicators |
| Indicator | chart, tables, metadata, formula, related indicators | validation list |
| Chart slider | displayed chart viewport | table range, flagged point definition |
| Evidence range | saved highlight/export range | display period |

## Center Review Surface

For the active pair, show:

- current/previous/published-when-present table,
- indicator code/name and desk series title row,
- line chart,
- formula inside the chart container,
- related indicators.

The current/previous/published-when-present table appears above the line chart. Decimal-place controls live in the top header and apply to center tables. The chart x-axis slider changes only the chart viewport. Evidence range and highlights are separate. If no related indicators exist, the related indicators area shows a compact empty state.

## Desk Explanation

Desk explanation sits in the right panel above the draft.

It is filtered by:

```text
validation + indicator
```

Display:

- time period,
- explanation or confirmation text.

Long text should be clamped, expandable, or shown in a popover.

## AI Draft Interaction

The right panel shows only the current active pair.

It does not:

- list all kept pairs,
- manage evidence,
- act as the final email editor,
- provide a persistent skip list.

When a pair loads:

1. If no draft exists, the mock draft service may generate one.
2. Status becomes `generating`.
3. Success sets status to `draft`.
4. Failure sets status to `error`.

User actions:

- `Keep`: status becomes `kept`.
- Edit text: status becomes `edited`.
- `Skip`: leaves the draft unkept/unedited and creates no persistent skip state.
- No action: draft remains ignored.

## Evidence And Highlighting

Defaults:

- line chart included,
- current data table not included,
- related indicators table not included.

Highlight targets:

- chart point,
- chart region or interval,
- table cell,
- table row,
- table column,
- related indicator row/value.

Nice-to-have:

- left-drag adds chart highlight interval,
- right-drag removes or shrinks highlight interval,
- toolbar modes can replace right-drag if browser behavior conflicts.

Pair switching:

- unsaved temporary highlights clear,
- saved highlights restore.

## Completion Flow

`Complete` is enabled only when all flagged pairs are visited.

If unvisited pairs remain:

- show remaining count,
- provide a next-unvisited action.

If all pairs are visited and no snippets are kept/edited:

- show review complete,
- do not generate email.

If kept/edited snippets exist:

- group by sector,
- merge by indicator,
- include selected evidence state,
- open overall edit or mock output.

## Acceptance Scenarios

- User can traverse all flagged pairs by keyboard.
- Loading a pair marks it visited.
- Drafts do not enter final output until kept or edited.
- Kept and edited both appear as the raised-issue navigation marker.
- Related indicators ignore validation and severity.
- Issues report changes with validation + indicator.
- Complete blocks until all pairs are visited.
- No-issue completion works.
- With-issue completion opens overall edit or mock output.
