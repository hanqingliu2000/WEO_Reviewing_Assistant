# Slice 06: Complete And Overall Edit

## Goal

Close the review loop after all flagged pairs are visited.

## Include

- complete control,
- unvisited count,
- next-unvisited action,
- no-issue completion,
- overall edit screen,
- sector grouping,
- indicator-level merging,
- mock output generation.

## Exclude

- real Outlook draft,
- real file export,
- real evidence file generation.

## Rules

- Complete requires all flagged pairs visited.
- Only kept and edited snippets enter final output.
- Draft, empty, error, and unvisited snippets do not enter final output.
- No explicit skipped snippets.
- Overall edit is where kept/edited content can be removed.

## Acceptance

- Complete is blocked when unvisited pairs remain.
- All-visited/no-issue path works and does not create mock email.
- All-visited/with-issues path opens overall edit.
- Overall edit groups by sector and merges by indicator.
- Mock output can be generated without file system access.
