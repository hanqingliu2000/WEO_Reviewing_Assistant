# WEO Reviewing Assistant

## Project Goal

WEO Reviewing Assistant is an exploratory MVP for improving the WEO validation review workflow. The current product direction is a **local-first review workbench**: a modern browser UI running on localhost that recreates and improves the core review flow of the existing validation report.

The core rule is simple:

```text
Reviewer decides. AI writes.
```

AI does not pre-screen flags, rank issues, or decide what should be raised. Reviewers visit and review `sector + validation + indicator` pairs. When a reviewer keeps or edits a draft, the selected content can later be merged into a final email draft.

## Current Architecture Direction

The current MVP direction is:

- **Frontend**: modern web UI running locally in the browser.
- **Build target**: static frontend assets that can be served by a local backend.
- **Backend direction**: Flask as the local Python API layer.
- **Data source direction**: local exported data files, mapped by the Python layer into frontend-facing JSON objects.
- **AI role**: draft language from user-selected context only.
- **Future packaging**: keep a path open for Electron or Tauri desktop wrapping, or hosted deployment if IT later approves it.

For the frontend phase, the project intentionally uses mock data, mock draft generation, and mock export state. Real backend data mapping, real AI calls, Outlook integration, SharePoint integration, and desktop packaging are outside the current implementation scope.

## Key Product Challenges

- **Data mapping**: real source tables, fields, joins, periods, and indicator identities must be mapped carefully before any real data integration.
- **Review workflow fidelity**: the new UI should preserve the key review logic while improving navigation, layout, typography, expand/collapse, and evidence handling.
- **Grounded draft text**: AI-generated language must be based on explicit data context and rule explanations. Unsupported claims should not enter the draft.
- **Reviewer writing style**: the MVP can start with a team-level template; reviewer-specific style profiles can be explored later.
- **State recovery**: visited, kept, edited, draft, and evidence state should be recoverable locally during the review session.
- **Deployment constraints**: reviewer machines may not be able to run Node/Vite build commands, so build and runtime responsibilities must remain separate.

## MVP Scope

The first frontend implementation should provide:

1. A three-column review workbench.
2. Left navigation for sector, severity, validation, and indicator.
3. Center review surface with chart, current/previous/published table, issues report history, related indicators, metadata, and evidence controls.
4. Right active draft panel for the current review pair only.
5. Visited state when a pair loads successfully.
6. Keep/edit workflow for deciding what enters the final output.
7. Complete gate requiring all flagged pairs to be visited.
8. No-issue completion when nothing is kept or edited.
9. Overall edit or mock output flow when kept/edited snippets exist.
10. Mock data that is fully synthetic and safe for local development.

## Core Concepts

### `ReviewItem`

A selectable review unit:

```text
sector + validation + indicator
```

### `ReviewItemDetail`

The detailed center-panel context for one `ReviewItem`, including series data, explanation, recommended action, metadata, issues report entries, and related indicators.

### `DraftSnippet`

An editable draft text block for one review item. Only `kept` or `edited` snippets enter the final output.

### `EvidenceSelection`

Per-item evidence settings. The line chart is included by default; current data table and related indicators table are optional.

### `EmailDraftOutput`

The final grouped output after completion. It groups by sector and merges multiple validations under the same indicator.

## Repository Structure

```text
docs/
  development/          Authoritative implementation docs
  discussion_and_demo/  Lower-priority planning and demo notes

frontend/
  src/
    data/               Synthetic mock frontend data
    types/              Shared frontend TypeScript types
    components/         Planned component module folders
    state/              Planned frontend session state
    services/           Planned mock service boundary
    styles/             Planned design tokens and global styles
```

## Development Documents

Start here:

- `docs/development/frontend_developer_brief.md`
- `docs/development/frontend_build_plan.md`
- `docs/development/frontend_code_organization.md`
- `docs/development/mock_data_spec.md`
- `docs/development/work_computer_stack_smoke_test.md`

Detailed reference docs are under:

- `docs/development/reference/`

Background and discussion materials are lower priority. If any document conflicts, follow `docs/development/`.

## Frontend Stack Decision

Current recommended stack:

- React
- Vite
- TypeScript
- Zustand
- Apache ECharts
- TanStack Table
- Tailwind CSS
- shadcn/ui + Radix UI

Known work-computer constraint:

- npm package installation appears to work.
- running package binaries such as `vite` through `npx`, `npm exec`, or `npm run` is currently blocked by IT policy.
- reviewer machines may not need to build the frontend if prebuilt static assets are served by Flask.

## Mock Data Safety

The repository contains synthetic mock data only. It does not include real country names, real WEO data, real validation output, source report media, API keys, or internal file paths.
