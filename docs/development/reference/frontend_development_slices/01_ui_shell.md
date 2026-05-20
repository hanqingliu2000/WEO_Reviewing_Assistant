# Slice 01: UI Shell

## Goal

Create the first visible workbench shell.

## Include

- three-column layout,
- `SessionHeader`,
- settings placeholder,
- IMF/WEO placeholder identity area,
- base tokens and global layout styles,
- responsive behavior for laptop, ultrawide, and half-ultrawide windows.

## Exclude

- real navigation logic,
- real chart/table data,
- real AI,
- backend integration.

## Components

- `AppShell`
- `SessionHeader`
- `Panel`
- shared badge/button primitives as needed

## Acceptance

- App opens directly to the workbench.
- Left, center, and right panels are visible.
- Center panel gets the most space.
- No text is smaller than 11px.
- Settings placeholder exists but does not need full behavior.
- Status placeholder does not react to sector changes.
