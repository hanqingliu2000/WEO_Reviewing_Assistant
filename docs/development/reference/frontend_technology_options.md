# Frontend Technology Stack Decision

## Decision Summary

Current frontend stack:

```text
React + Vite + TypeScript
Zustand for frontend state
Apache ECharts for charts
TanStack Table for tables
shadcn/ui + Radix UI for reusable UI primitives
Tailwind CSS for styling
Mock service boundary before real backend or AI integration
Future desktop wrapper: compare Tauri and Electron after UI stabilizes
```

This stack supports the current goal: build a localhost modern web UI with high-quality frontend interaction before implementing real backend data mapping, AI calls, file export, or desktop packaging.

## React + Vite + TypeScript

Use React with Vite and TypeScript.

Reasons:

- React fits the three-column workbench structure.
- Vite is lighter than Next.js for a local tool.
- TypeScript reduces drift in shared objects such as `ReviewItem`, `DraftSnippet`, and `EvidenceSelection`.
- The app does not currently need SSR, SEO, hosted routing, or production web framework features.

Revisit Next.js only if the project later becomes a hosted web app.

## Zustand

Use Zustand for frontend session state.

State must cover:

- active review item,
- visited pairs,
- kept and edited pairs,
- draft snippets,
- evidence selections,
- font scale and density,
- completion readiness.

Rules:

- Key state by `review_item_id` where possible.
- Keep backend and AI implementation details out of the store.

## Apache ECharts

Use ECharts for charts.

Required capabilities:

- current/previous/optional published series,
- flagged point markers,
- flagged period shading,
- user-selected highlight regions,
- responsive resize,
- tooltip context,
- legend,
- data zoom or brush,
- visual consistency for later export.

Reconsider Plotly only if exploratory chart interaction becomes more important than bundle size and visual integration.

## TanStack Table

Use TanStack Table first.

Required capabilities:

- dense rows,
- adjustable font size,
- horizontal scroll,
- sticky headers,
- current/previous/optional published display,
- flagged cell highlight,
- manual row/cell/column highlight,
- related indicators table,
- future virtualization if needed.

Reconsider AG Grid Community only if tables become closer to spreadsheet-grade data grids.

## shadcn/ui + Radix UI + Tailwind CSS

Use shadcn/ui with Radix primitives and Tailwind.

Reasons:

- accessible primitives,
- editable local components,
- useful controls for menus, dialogs, tooltips, accordions, toggles, and settings,
- fast iteration while keeping domain components separate.

Rules:

- Use shadcn/Radix for generic primitives.
- Keep domain logic in project components.
- Align tokens with `frontend_visual_design_baseline.md`.

## Service Boundary

Use mock services first.

Initial interface:

```ts
interface ReviewWorkbenchServices {
  loadReviewSession(sessionId?: string): Promise<ReviewSession>;
  loadReviewItems(sessionId: string): Promise<ReviewItem[]>;
  loadReviewItemDetail(reviewItemId: string): Promise<ReviewItemDetail>;
  generateDraft(reviewItemId: string): Promise<DraftSnippet>;
  saveDraftSnippet(snippet: DraftSnippet): Promise<void>;
  saveEvidenceSelection(selection: EvidenceSelection): Promise<void>;
  completeReview(sessionId: string): Promise<EmailDraftOutput | NoIssueCompletion>;
  exportEvidence(reviewItemId: string): Promise<MockExportResult>;
}
```

This isolates the frontend from future Flask, AI, and export implementations.

## Desktop Packaging

Desktop packaging is not in the current scope.

Current rule:

- Build a pure web UI first.
- Keep file paths out of components.
- Keep data, AI, and export behind services.

Compare Tauri and Electron after the UI stabilizes.

## Work-Computer Findings

Confirmed so far:

- Node/npm/git are available.
- npm can install React, Vite/TypeScript, ECharts, TanStack Table, and Zustand.

Blocked:

- `npx`,
- `npm exec`,
- npm scripts that execute local package binaries such as Vite.

Interpretation:

- The work computer is not currently viable for Vite development.
- Development can continue on an unrestricted machine.
- Reviewer deployment may still work if Flask serves prebuilt static assets.

## Confirmed Primary Stack

| Layer | Decision |
| --- | --- |
| App framework | React |
| Build tool | Vite |
| Language | TypeScript |
| State | Zustand |
| Charts | Apache ECharts |
| Tables | TanStack Table |
| UI primitives | shadcn/ui + Radix UI |
| Styling | Tailwind CSS plus project tokens |
| Data / AI | Mock services for now |
| Future desktop | Tauri/Electron comparison later |

## Remaining Checks

- Can Tailwind packages install?
- Can Radix packages install?
- Can plain local HTML run?
- Can prebuilt static output run on the work computer?
- Can Flask serve the prebuilt frontend?
- Can a plain Node localhost server run?
- Can browser localStorage persist review state?
