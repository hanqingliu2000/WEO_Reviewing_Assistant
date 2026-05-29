# Slice 01: UI Shell

## Goal

Create the first visible workbench shell.

## Include

- three-column layout,
- `SessionHeader`,
- `Other Settings` placeholder,
- tool name/logo placeholder in the top-left of the header,
- decimal-place controls in the top header next to settings, supporting 0-9 decimal places,
- font-size controls in the top header near settings,
- searchable country filter in the top header,
- base tokens and global layout styles,
- user-resizable left navigation panel,
- user-resizable right draft panel,
- responsive behavior for laptop, ultrawide, and half-ultrawide windows.

## Exclude

- real navigation logic,
- real chart/table data,
- real AI,
- backend integration.

## Components

- `ReviewWorkspace`
- `SessionHeader`
- `Panel`
- shared badge/button primitives as needed

## Rules

- Workbench layout is `left navigation -> center review surface -> right draft panel`.
- Center review surface receives the largest flexible area by default.
- Top header should stay compact and should not show reviewer name or submission timestamp.
- Top header keeps a small tool identity placeholder on the left while the country selector remains horizontally centered.
- Report identity switching lives at the top of the left navigation, not in the top header.
- Country selector is a searchable dropdown; it filters by country code or country name.
- Country selector groups countries into assigned countries and other countries.
- Assigned countries use a light gray row background and a compact right-side rounded `P` or `B` badge for primary or backup assignment.
- Assigned and other country groups are separated by a thin light divider.
- Current country switching is UI-only in the mock slice and does not need to reload the full mock review dataset yet.
- Left navigation starts at its minimum width so the center surface has more room on first load.
- Left navigation remains user-resizable within configured min/max bounds.
- Right draft panel remains user-resizable within configured min/max bounds.
- Resize handles should be visually narrow and should not waste horizontal workspace.
- The right draft panel maximum should stay modest and must not exceed one third of the viewport width on desktop layouts.
- Decimal-place controls live in the top `SessionHeader`, not inside the center table, and allow 0-9 decimal places.
- Font-size controls live in the top `SessionHeader` near settings.
- Font-size controls support the default size plus up to four larger steps.
- Font-size controls do not change the top header's own font size.
- Increasing font size must preserve the outer workbench and panel bounds; content should wrap, truncate, or scroll internally instead of overflowing the page.

## Acceptance

- App opens directly to the workbench.
- Left, center, and right panels are visible.
- Left and right panels can be manually resized on desktop layouts.
- Center panel gets the most space.
- No text is smaller than 11px.
- Other Settings placeholder exists but does not need full behavior.
- Country search can filter and select a mock country.
