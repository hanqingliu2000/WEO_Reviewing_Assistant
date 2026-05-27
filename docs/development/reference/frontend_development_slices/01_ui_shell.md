# Slice 01: UI Shell

## Goal

Create the first visible workbench shell.

## Include

- three-column layout,
- `SessionHeader`,
- `Other Settings` placeholder,
- decimal-place controls in the top header next to settings,
- font-size controls in the top header near settings,
- switchable report identity brand area for WEO and MCD REO,
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
- Report identity is a full-width colored brand block, not a separate square logo.
- Report identity can switch between WEO and MCD REO from a dropdown.
- Report identity dropdown options should match the displayed brand block width, content, and visual style.
- Country selector is a searchable dropdown; it filters by country code or country name.
- Current country switching is UI-only in the mock slice and does not need to reload the full mock review dataset yet.
- Left navigation starts at its minimum width so the center surface has more room on first load.
- Left navigation remains user-resizable within configured min/max bounds.
- Right draft panel remains user-resizable within configured min/max bounds.
- Resize handles should be visually narrow and should not waste horizontal workspace.
- The right draft panel maximum should stay modest and must not exceed one third of the viewport width on desktop layouts.
- Decimal-place controls live in the top `SessionHeader`, not inside the center table.
- Font-size controls live in the top `SessionHeader` near settings.
- Font-size controls support the default size plus up to four larger steps.
- Increasing font size must preserve the outer workbench and panel bounds; content should wrap, truncate, or scroll internally instead of overflowing the page.

## Acceptance

- App opens directly to the workbench.
- Left, center, and right panels are visible.
- Left and right panels can be manually resized on desktop layouts.
- Center panel gets the most space.
- No text is smaller than 11px.
- Other Settings placeholder exists but does not need full behavior.
- Country search can filter and select a mock country.
