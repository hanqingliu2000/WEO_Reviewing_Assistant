# Frontend Visual Design Baseline

## Purpose

This document defines the visual baseline for the local-first review workbench. It is not a high-fidelity design file. It sets shared rules so independently built slices still feel like one professional application.

The target style is:

```text
professional, dense, calm data workbench
```

Do not build a marketing page or an AI showcase.

## Target Work Environments

The UI must adapt to three common office layouts:

1. Laptop fullscreen.
2. 3440 x 1440 ultrawide fullscreen.
3. Half of a 3440 x 1440 ultrawide monitor.

Use browser/window width to adapt. The three-column layout should remain usable across all three.

## Layout Rules

- The first screen is the workbench.
- Keep the left and right panels compact.
- Give the center review surface the most space.
- Left and right panels may be user-resized within modest bounds.
- The left panel defaults to its configured minimum width.
- Neither side panel should exceed one third of the viewport width on desktop layouts.
- Use horizontal scrolling for wide time-period tables.
- On ultrawide screens, increase useful content density rather than simply scaling fonts.
- Avoid nested cards.
- Do not use decorative gradient blobs or one-note color backgrounds.

## Typography

- Headings and titles: Arial.
- Rare strong display headings: Arial Black.
- Body, tables, navigation, forms, draft text: Segoe UI.
- Minimum visible text size: 11px.
- Provide small/default/large font scale settings.
- Font scale must not break layout.

## Brand And Color

Primary brand color:

```text
#004c97
```

Secondary brand color:

```text
#009cde
```

Rules:

- Use brand colors for primary actions, active states, and selected navigation.
- Use gray/black for neutral UI structure and inactive states.
- Avoid large saturated red, green, yellow, or orange surfaces.
- Use red, orange, and yellow only for issue, warning, or flag semantics.
- Do not rely on color alone; pair important states with icons, badges, labels, or weight.

## Header Identity

Official identity assets are not required in the first version. Report identity switching lives at the top of the left navigation, not in the top header.

Rules:

- WEO uses the primary brand blue.
- MCD REO uses a gold button.
- Selected identity keeps its solid brand color, border, and light shadow.
- Unselected identity uses a thick border in its own brand color with transparent or near-transparent fill, not a neutral black/gray.
- Identity buttons should feel like a modern segmented control and use heavier/larger type than sector rows.
- The navigation content controlled by the identity switch may use a subtle matching border and very transparent background to reinforce the active exercise.
- The top header remains reserved for the tool identity placeholder, centered country selection, and display controls.

## Table Behavior

- Tables with time periods should default-scroll horizontally to the newest/rightmost period.
- After users manually scroll, do not immediately snap back to the right.
- Keep row height compact but readable.
- Sticky headers are preferred.
- Missing values should be visually quiet.

## Chart Behavior

- Show current and previous series by default.
- Published series is optional in the data. When present, it can be shown directly with current and previous; no chart options menu is required for the current slice.
- Flagged periods and flagged points should be visible.
- Use an x-axis range/data zoom control.
- Auto-scale y-axis to the visible range. Extra y-axis padding refinement is not required for the current slice.
- Support multiple non-contiguous highlight intervals.

## Settings

Place display preferences in a compact settings control:

- font scale with default plus up to four larger steps,
- density,
- optional chart/table display toggles.

Settings should not occupy primary review space.
Increasing font scale must not expand the outer workbench beyond the viewport; panels should preserve their bounds and use internal scrolling, wrapping, or truncation as needed.
