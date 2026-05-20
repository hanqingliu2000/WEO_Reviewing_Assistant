# Frontend Code Organization

## Purpose

This document defines how frontend code should be organized once implementation starts.

Core principle:

```text
Docs are organized by development slice.
Code is organized by long-term product module.
```

Do not place production code under `frontend/slices/`. Use stable domain folders so future manual edits are easy to find.

## Recommended Tree

```text
frontend/
  README.md
  package.json
  src/
    app/
      App.tsx
      providers/
      routes/
    components/
      layout/
        AppShell.tsx
        SessionHeader.tsx
        Panel.tsx
      navigation/
        ReviewNavigator.tsx
        SectorList.tsx
        SeverityFilter.tsx
        ValidationList.tsx
        IndicatorList.tsx
      review-surface/
        ReviewSurface.tsx
        ActiveContextHeader.tsx
        TimePeriodControl.tsx
        LineChartPanel.tsx
        CurrentPreviousPublishedTable.tsx
        IssuesReportPanel.tsx
        RelatedIndicatorsTable.tsx
        MetadataAccordion.tsx
        ChartOptionsMenu.tsx
      evidence/
        EvidenceToolbar.tsx
        HighlightModeToggle.tsx
        EvidenceRangeControl.tsx
        MockEvidencePreview.tsx
      draft/
        ActiveDraftPanel.tsx
        DraftEditor.tsx
        DraftStatusBadge.tsx
      completion/
        CompleteReviewControl.tsx
        OverallEditScreen.tsx
        SectorDraftGroup.tsx
        IndicatorMergedDraftBlock.tsx
        OutputExportPanel.tsx
      shared/
        StatusBadge.tsx
        CountPill.tsx
        IconButtonWithTooltip.tsx
        EmptyState.tsx
        ErrorBanner.tsx
    state/
      reviewSessionStore.ts
      selectors.ts
    services/
      reviewWorkbenchServices.ts
      mockReviewWorkbenchServices.ts
    data/
      mockReviewData.ts
    types/
      review.ts
    styles/
      tokens.css
      globals.css
```

This tree assumes React/Vite, but the domain organization should remain stable even if the framework changes later.

## Slice To Folder Mapping

| Slice | Primary folders | Notes |
| --- | --- | --- |
| `01_ui_shell` | `app/`, `components/layout/`, `components/shared/`, `styles/` | Layout, header, and baseline visual language. |
| `02_left_navigation` | `components/navigation/`, `components/shared/`, `state/` | Sector, severity, validation, indicator navigation. |
| `03_center_review_surface` | `components/review-surface/`, `components/shared/`, `data/` | Chart, tables, issues history, metadata. |
| `04_review_state_flow` | `state/`, `app/providers/`, `navigation/`, `review-surface/` | Active pair, visited state, progress. |
| `05_active_draft_panel` | `components/draft/`, `state/`, `services/` | Mock draft generation and keep/edit flow. |
| `06_complete_overall_edit` | `components/completion/`, `state/`, `services/`, `types/` | Complete gate, no-issue completion, final grouping. |
| `07_evidence_highlighting` | `components/evidence/`, `review-surface/`, `state/` | Evidence toggles and highlight state. |
| `08_integration_readiness` | `services/`, `types/`, `state/`, `data/` | Service boundary for later Flask/API integration. |

## Naming Rules

- Components use PascalCase: `ReviewNavigator`, `ReviewSurface`, `ActiveDraftPanel`.
- Component filenames match component names.
- Shared types stay in `src/types/review.ts`.
- Session state should use stable names: `unvisited`, `visited`, `active`, `kept`, `edited`, `kept-or-edited`.
- Draft states should use: `empty`, `generating`, `draft`, `kept`, `edited`, `error`.
- Do not introduce persistent `skip` state.

## Service Boundary

Components should call service functions instead of importing backend details directly.

Initial service names:

- `loadReviewSession`
- `loadReviewItemDetail`
- `generateDraft`
- `saveDraftSnippet`
- `saveEvidenceSelection`
- `completeReview`
- `exportEvidence`

Current implementation should use mock services. Future Flask integration should replace the service adapter without forcing component rewrites.

## Manual Editing Rules

When changing a feature:

1. Start with the domain folder.
2. Read the module README if available.
3. Check `frontend_developer_brief.md`.
4. Use `reference/frontend_interaction_spec.md` only when more detail is needed.
5. Keep backend, AI, file paths, and API keys out of components.

## Current Out Of Scope

- Real local Python API.
- Real AI calls.
- Real file export.
- Outlook or SharePoint integration.
- Desktop packaging.

Mock adapters and typed interfaces may exist so these features can be added later.
