# One-Page Infographic Notes

## Core Message

Build a local-first WEO validation review workbench.

```text
Reviewer decides.
AI writes.
```

The app recreates and improves the core review workflow. Reviewers visit and assess `sector + validation + indicator` pairs. AI turns kept or edited selections into clearer draft language.

## Main Path

```text
Local exported data files
  -> Flask local Python API
  -> Local-first review workbench
  -> User visits review pairs
  -> User keeps or edits draft snippets
  -> System merges by sector and indicator
  -> Overall edit / mock output
```

## Parallel Branches

### Runtime

- Current target: localhost browser app.
- Future option: Electron or Tauri wrapper.
- Future option: hosted app if IT approves.

### Frontend

- React + Vite + TypeScript.
- Zustand for state.
- ECharts for charting.
- TanStack Table for tables.
- Tailwind + shadcn/Radix for UI primitives.

### Backend

- Current frontend phase: mock services.
- Likely next backend layer: Flask.
- Future replacement possible if hosting or packaging constraints change.

### AI

- Current frontend phase: mock draft service.
- Future phase: selected-context-to-language generation.
- Not in scope: AI pre-screening or issue ranking.

### Evidence

- Default: line chart.
- Optional: current data table.
- Optional: related indicators table.
- Highlights should match what reviewers see on screen.

## Required Access Points

- local exported data files,
- Python runtime and Flask approval,
- browser access to localhost,
- approved build environment for frontend static assets,
- future AI API or internal gateway approval,
- future file/output path approval.

## Future Inputs Needed

- real source table inventory,
- data dictionary,
- join and lineage mapping,
- UI-facing API contract,
- AI context contract,
- team-level email template,
- sample non-sensitive review language,
- deployment constraints from IT.

## MVP Scope

- three-column workbench,
- mock data,
- left navigation,
- center chart/table/issues/related view,
- active draft panel,
- visited state,
- keep/edit state,
- complete gate,
- no-issue completion,
- overall edit or mock output.

## Success Criteria

- reviewer can move from first flag to last flag smoothly,
- UI is faster and clearer than current workflow for the tested path,
- draft text only appears after user-selected context,
- no kept/edited content means no email,
- kept/edited content merges correctly,
- deployment path does not require reviewers to build the frontend.

## Not In MVP

- real data pipeline,
- real AI API,
- real Outlook draft creation,
- SharePoint integration,
- production desktop packaging,
- full replacement of every existing report view.
