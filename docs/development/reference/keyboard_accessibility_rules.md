# Keyboard Accessibility Rules

## Purpose

Keyboard support should make the review workflow faster and more predictable than the current report interaction.

## Core Traversal

When focus is in the indicator list:

- `ArrowDown` moves to the next indicator.
- At the end of a validation, it moves to the first indicator under the next validation.
- At the end of a sector, it moves to the first available validation/indicator under the next sector.
- `ArrowUp` reverses the traversal.
- `Enter` or `Space` activates the focused pair.

## Navigation Requirements

- Sector, severity, validation, and indicator controls must be keyboard reachable.
- Focus state must be visible.
- Active state and focus state must not be confused.
- Indicator remains single-select.
- Next-unvisited action must be reachable by keyboard.

## Draft Panel

- Textarea must be keyboard reachable.
- Keep, regenerate, restore original, and complete controls must be keyboard reachable.
- No hidden skip control is required.

## Chart And Table

- Tables must be keyboard readable through normal browser navigation.
- Chart point keyboard access is desirable but not required for MVP if table values are accessible.
- Highlight actions should have toolbar alternatives if drag gestures are not accessible.

## Accessibility Rules

- Do not rely on color alone.
- Use labels, icons, badges, or text for important states.
- Tooltips should not be the only way to understand an action.
- Minimum visible text size is 11px.
