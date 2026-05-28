# Slice 07: Evidence And Highlighting

## Goal

Add evidence selection and highlight interaction in the center review surface.

## Include

- evidence toggles,
- line chart default evidence,
- current data table optional evidence,
- related indicators optional evidence,
- temporary highlights,
- saved highlights,
- multiple chart intervals,
- add/remove highlight mode,
- mock export preview.

## Exclude

- real evidence export,
- browser automation,
- email attachments.

## Rules

- Evidence content is rendered in the center panel.
- Evidence inclusion choices can be exposed beside the right-panel `Raise` action as compact checkboxes, but the right panel does not display evidence media.
- Line chart is included by default.
- Current data table is off by default.
- Related indicators table is off by default.
- The chart evidence target includes the indicator code/title, indicator name/subtitle, desk series, formula, and chart as one component-level capture region.
- Switching active review item resets evidence inclusion choices to their defaults.
- Switching pair clears unsaved temporary highlights.
- Saved highlights restore when returning to a pair.
- If right-drag conflicts with browser behavior, use toolbar modes.

## Acceptance

- Evidence toggles affect mock export preview.
- Multiple chart intervals can coexist.
- Highlights can be saved per pair.
- Unsaved highlights clear on pair switch.
- Saved highlights restore on return.
- Draft panel remains free of evidence media.
