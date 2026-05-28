# Frontend Developer Brief

## 1. What We Are Building

Build a local-first WEO validation review workbench.

Current scope is frontend and interaction only:

- Modern localhost/browser UI.
- Mock data.
- Mock draft generation.
- Mock export state.
- No real backend.
- No real AI API.
- No real Outlook / SharePoint integration.
- No desktop packaging yet.

The first implementation should create a professional three-column data review workbench:

```text
Left navigation -> Center review surface -> Right active draft panel
```

## 2. Current Stack Decision

Use:

- React
- Vite
- TypeScript
- Zustand
- ECharts
- TanStack Table
- Tailwind CSS
- shadcn/ui + Radix UI

Important work-computer finding:

- npm package install works for React, Vite/TypeScript, ECharts, TanStack Table, and Zustand.
- Running Vite binaries is blocked on the work computer by IT policy.
- Development should proceed on an unrestricted machine for now.
- Work-computer deployment should test prebuilt static output or request IT approval for package binary execution.

See [work_computer_stack_smoke_test.md](work_computer_stack_smoke_test.md).

## 3. Core Product Rules

- Review unit is `sector + validation + indicator`.
- AI never selects issues.
- User visits pairs; `ReviewSurface` load success marks a pair as `visited`.
- Visited pairs should be visually marked with subtle background/color coding.
- User can edit draft text and `Raise` the current draft text when they want the issue included.
- `kept` and `edited` both mean "will be raised." The navigation does not need to visually distinguish them; both can share one raised-issue marker.
- Unkept and unedited drafts are ignored automatically.
- Complete requires all flagged pairs visited.
- If all pairs are visited and no kept/edited content exists, review completes with no email generated.
- Right panel shows only the current active pair draft, not a list of all kept pairs.
- Final removal/reordering happens in overall edit, not the active draft panel.

## 4. Center Review Surface Requirements

The center surface must include:

- Current / previous / optional published table.
- Indicator code and indicator name above the chart.
- Desk series on the right side of the chart title row.
- Formula inside the chart container top area.
- ECharts line chart.
- Related indicators table.

Important behavior:

- Related indicators depend only on indicator.
- Issues report / desk explanation depends on validation + indicator pair and is displayed in the right panel.
- Decimal-place controls live in the top header next to settings and apply to center tables.
- Evidence/highlight range is separate from display range.
- Tables with time periods should initially scroll to the newest/rightmost period.
- Current / previous / optional published table appears above the line chart.
- After user manually scrolls a table, do not immediately jump it back to the right.

## 5. Chart And Highlight Rules

Charts should support:

- current / previous series by default.
- optional published series shown directly when data exists.
- flagged point markers.
- flagged period shading.
- x-axis draggable range bar / data zoom controlled only by the explicit chart slider.
- no mouse-wheel or vertical trackpad zoom over the chart area.
- y-axis auto-scale to visible data; additional padding refinement can wait until a later chart pass.
- multiple non-contiguous highlight intervals.
- Current line color: `#e66c37`.
- Previous line color: `#0d6abf`.
- Published line color: light grey.

Nice-to-have:

- left-drag adds highlight range.
- right-drag removes/shrinks highlight range.
- if right-drag conflicts with browser behavior, provide toolbar modes for add/remove highlight.

## 6. Desk Explanation And Draft Panel

The right panel has two major areas:

- `Desk Explanation`, sourced from prior issues report entries.
- `Draft`, with mock draft text and review actions.

It shows prior issue explanations / confirmations for the current validation + indicator pair.

Display:

- time period.
- explanation text.

Text behavior:

- 2-3 lines should be readable.
- longer text should clamp/collapse with expand or popover.

The right panel should not repeat indicator id/name, recommended action, or flagged periods. These fields remain in mock data and may be used by later state or generation logic.

Draft action and evidence options:

- `Raise` is yellow and captures the current editable draft text.
- `Ctrl+Enter` triggers the same `Raise` behavior.
- Evidence checkboxes are `Table`, `Chart`, and `Related indicators`; only `Chart` is selected by default.
- Evidence checkboxes reset when the active review item changes.

## 7. Visual Baseline

Fonts:

- Headings/titles: Arial, with Arial Black only for rare strong titles.
- Body/table/navigation/draft text: Segoe UI.
- Minimum font size: 11px.

Colors:

- Primary brand: `#004c97`
- Secondary brand: `#009cde`
- Avoid large saturated red/green/yellow/orange areas.
- Use red/orange/yellow only for issue/warning semantics.

Top Header:

- Report identity switching lives at the top of the left navigation with WEO and MCD REO buttons.
- Selected report identity uses its solid brand color; unselected report identity uses a semitransparent version of its own brand color.
- Report identity buttons should read as higher-level controls than sector rows, with modern button styling and heavier type.
- The top header keeps a small tool name/logo placeholder on the left while the country selector remains centered.
- Country selection is a searchable dropdown that filters by country code or name and groups assigned countries separately from other countries.
- Assigned countries show a light gray row background and a compact `P` or `B` badge for primary or backup assignment.
- Current country switching is UI-only for this frontend phase and does not reload real data.
- Do not show reviewer name or submission timestamp in the compact top bar.

Responsive targets:

- laptop fullscreen.
- 3440 x 1440 ultrawide fullscreen.
- half ultrawide window.

## 8. First Build Sequence

Follow [frontend_build_plan.md](frontend_build_plan.md).

Recommended first implementation order:

1. Scaffold frontend project.
2. UI shell.
3. Left navigation.
4. Center review surface.
5. Review state flow with local browser persistence.
6. Active draft panel.
7. Complete / overall edit.
8. Evidence and highlighting.
9. Integration readiness.

Do not start real AI or real backend before the review flow works with mock data.

## 9. Code Organization

Code should be organized by long-term product module, not by slice.

Key folders:

```text
frontend/src/main.tsx
frontend/src/features/review/repo
frontend/src/features/review/runtime
frontend/src/features/review/types
frontend/src/features/review/ui
frontend/src/features/review/ui/layout
frontend/src/features/review/ui/navigation
frontend/src/features/review/ui/review-surface
frontend/src/shared/ui
frontend/src/shared/styles
```

See [frontend_code_organization.md](frontend_code_organization.md).

## 10. Must-Pass Checks For Early UI

- Three columns do not overlap at laptop, half-ultrawide, and ultrawide widths.
- Top header remains compact with tool identity placeholder, centered searchable country selector, and display controls.
- Left and right side panels can be manually resized on desktop layouts.
- Left panel defaults to its configured minimum width.
- No visible text below 11px.
- Keyboard can traverse indicators, validations, and sectors.
- Left navigation hierarchy is sector, validation, then indicator.
- Severity is a marker/metadata, not a required hierarchy level.
- Indicator is single-select.
- Related indicators ignore validation/severity changes.
- Desk explanation changes with validation + indicator.
- Table default scroll shows newest period.
- Visited state survives reload in same browser/profile.
- Kept and edited both appear as the raised-issue navigation marker.
- Complete remains unavailable until all flagged pairs visited.

## 11. Reference Docs

Detailed docs have been demoted to reference to keep the development root clean:

- [reference/frontend_interaction_spec.md](reference/frontend_interaction_spec.md)
- [reference/ui_component_inventory.md](reference/ui_component_inventory.md)
- [reference/frontend_visual_design_baseline.md](reference/frontend_visual_design_baseline.md)
- [reference/frontend_acceptance_checklist.md](reference/frontend_acceptance_checklist.md)
- [reference/keyboard_accessibility_rules.md](reference/keyboard_accessibility_rules.md)
- [reference/frontend_technology_options.md](reference/frontend_technology_options.md)
- [reference/frontend_development_slices/](reference/frontend_development_slices/)

Background PBI understanding is here:

- [background/powerbi_report_understanding.md](background/powerbi_report_understanding.md)
