# Slice 08: Integration Readiness

## Goal

Clean up boundaries so mock services can later be replaced by Flask or another approved local API without rewriting components.

## Include

- service interface,
- mock service adapter,
- consistent loading/error handling,
- typed response objects,
- no hard-coded local paths.

## Exclude

- real Flask implementation,
- real AI prompt/API,
- real file export,
- real data mapping.

## Suggested Service Interface

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

## Rules

- Components call services, not raw backend logic.
- Components should not import mock data except demo entrypoints.
- Service functions can later switch from mock to HTTP.
- API keys and local paths stay out of frontend code.

## Acceptance

- Mock data can be replaced through an adapter.
- Draft generation is isolated behind `generateDraft`.
- Evidence export is isolated behind `exportEvidence`.
- Completion is isolated behind `completeReview`.
