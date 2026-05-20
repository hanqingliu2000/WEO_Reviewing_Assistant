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

## Logo Placeholder

IMF/WEO logo or official identity assets should remain placeholders in the first version.

## Table Behavior

- Tables with time periods should default-scroll horizontally to the newest/rightmost period.
- After users manually scroll, do not immediately snap back to the right.
- Keep row height compact but readable.
- Sticky headers are preferred.
- Missing values should be visually quiet.

## Chart Behavior

- Show current and previous series by default.
- Published series is optional and should live in an options menu.
- Flagged periods and flagged points should be visible.
- Use an x-axis range/data zoom control.
- Auto-scale y-axis to the visible range with modest padding.
- Support multiple non-contiguous highlight intervals.

## Settings

Place display preferences in a compact settings control:

- font scale,
- density,
- optional chart/table display toggles.

Settings should not occupy primary review space.
