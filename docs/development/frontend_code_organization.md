# Frontend Code Organization

## Purpose

This document defines how frontend code is organized after the migration to a feature-first structure.

Core principle:

```text
Docs are organized by development slice.
Code is organized by product feature, with shared primitives separated from review-domain code.
```

Do not place production code under `frontend/slices/`. Slice documents describe build order; source files should live under stable feature or shared folders so future manual edits are easy to find.

## Current Tree

```text
frontend/
  README.md
  package.json
  vite.config.ts
  src/
    main.tsx
    features/
      review/
        repo/
          mockReviewData.ts
        runtime/
          navigationTree.ts
        types/
          review.ts
        ui/
          ReviewApp.tsx
          ReviewWorkspace.tsx
          layout/
            SessionHeader.tsx
          navigation/
            ReviewNavigator.tsx
            SectorList.tsx
            ValidationList.tsx
            IndicatorList.tsx
          review-surface/
            SeriesChart.tsx
    shared/
      styles/
        tokens.css
        globals.css
      ui/
        Panel.tsx
        StatusBadge.tsx
        CountPill.tsx
```

## Folder Responsibilities

| Folder | Owns | Notes |
| --- | --- | --- |
| `src/main.tsx` | React root and global style imports | Keep this thin. It should mount `ReviewApp` and import shared CSS only. |
| `features/review/ui/` | Review workbench screens and feature-specific UI | Current top-level shell is `ReviewWorkspace.tsx`. |
| `features/review/ui/layout/` | Review-specific layout pieces | `SessionHeader` lives here because it depends on review session metadata. |
| `features/review/ui/navigation/` | Sector / validation / indicator navigation | Includes collapse/expand behavior and keyboard traversal. |
| `features/review/ui/review-surface/` | Active review content visualization | Current chart implementation is `SeriesChart.tsx`; future table and issues panels should live here. |
| `features/review/runtime/` | Pure feature helpers and derived structures | `navigationTree.ts` builds the tree model from `ReviewItem[]`. Keep DOM-free logic here. |
| `features/review/repo/` | Mock data and future review data adapters | Current mock dataset lives in `mockReviewData.ts`. Future service adapters can be added here or under a sibling `services/` folder. |
| `features/review/types/` | Review-domain TypeScript types | `review.ts` is the canonical review feature contract. |
| `shared/ui/` | Reusable UI primitives | Components here must not import review-domain data or review feature files. |
| `shared/styles/` | Global CSS and design tokens | Tailwind is imported from `globals.css`; tokens stay in `tokens.css`. |

## Slice To Folder Mapping

| Slice | Primary folders | Notes |
| --- | --- | --- |
| `01_ui_shell` | `features/review/ui/`, `features/review/ui/layout/`, `shared/ui/`, `shared/styles/` | Layout, header, panel primitives, and baseline visual language. |
| `02_left_navigation` | `features/review/ui/navigation/`, `features/review/runtime/`, `shared/ui/` | Sector, validation, indicator hierarchy and keyboard traversal. |
| `03_center_review_surface` | `features/review/ui/review-surface/`, `features/review/repo/`, `features/review/types/`, `shared/ui/` | Chart, tables, issues history, related indicators, metadata. |
| `04_review_state_flow` | `features/review/ui/`, `features/review/runtime/`, future `features/review/state/` | Active pair, visited state, progress, and browser persistence. |
| `05_active_draft_panel` | future `features/review/ui/draft/`, future `features/review/state/`, future `features/review/repo/` | Mock draft generation and keep/edit flow. |
| `06_complete_overall_edit` | future `features/review/ui/completion/`, `features/review/types/`, future `features/review/state/` | Complete gate, no-issue completion, final grouping. |
| `07_evidence_highlighting` | future `features/review/ui/evidence/`, `features/review/ui/review-surface/`, future `features/review/state/` | Evidence toggles and highlight state. |
| `08_integration_readiness` | `features/review/repo/`, `features/review/types/`, future `features/review/services/` | Service boundary for later Flask/API integration. |

## Naming Rules

- Feature components use PascalCase: `ReviewWorkspace`, `ReviewNavigator`, `SeriesChart`.
- Component filenames match component names.
- Review-domain types stay in `src/features/review/types/review.ts`.
- Mock review data stays in `src/features/review/repo/mockReviewData.ts`.
- Shared UI primitives stay in `src/shared/ui/` and should not import from `features/review`.
- Session state should use stable names: `unvisited`, `visited`, `active`, `kept`, `edited`, `kept-or-edited`.
- Draft states should use: `empty`, `generating`, `draft`, `kept`, `edited`, `error`.
- Do not introduce persistent `skip` state.

## Service Boundary

Components should call review data/service functions instead of importing backend details directly.

Initial service names:

- `loadReviewSession`
- `loadReviewItemDetail`
- `generateDraft`
- `saveDraftSnippet`
- `saveEvidenceSelection`
- `completeReview`
- `exportEvidence`

Current implementation uses mock data from `features/review/repo/mockReviewData.ts`. Future Flask integration should replace the repo/service adapter without forcing UI component rewrites.

## Manual Editing Rules

When changing a review feature:

1. Start in `frontend/src/features/review/`.
2. Read the closest UI/runtime/types file before editing.
3. Check `frontend_developer_brief.md`.
4. Use `reference/frontend_interaction_spec.md` only when more detail is needed.
5. Keep backend, AI, file paths, and API keys out of UI components.

When changing shared visual primitives:

1. Start in `frontend/src/shared/ui/` or `frontend/src/shared/styles/`.
2. Confirm the change is truly shared and not review-specific.
3. Avoid importing feature-domain types into shared files.

## Current Out Of Scope

- Real local Python API.
- Real AI calls.
- Real file export.
- Outlook or SharePoint integration.
- Desktop packaging.

Mock adapters and typed interfaces may exist so these features can be added later.
