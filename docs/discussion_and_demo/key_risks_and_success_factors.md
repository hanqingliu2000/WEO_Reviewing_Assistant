# Key Risks And Success Factors

## Current Direction

The project direction is now:

```text
local-first review workbench
user-selected issues
AI-assisted drafting after user selection
modern frontend first
Flask as likely local Python API layer later
```

AI does not pre-screen issues or decide what should be raised.

## Success Factors

### Reviewer Workflow Fit

The tool must feel faster and clearer than the current review process.

Success requires:

- fast navigation,
- visible visited state,
- clear kept/edited state,
- keyboard traversal,
- readable chart/table layout,
- recoverable local state.

### Data Mapping

Real data integration depends on accurate mapping from source files to frontend concepts.

Critical questions:

- Which table contains validation results?
- Which fields identify sector, validation, indicator, and period?
- How are current, previous, and published values represented?
- How are related indicators joined?
- How are issues report entries matched to validation + indicator?
- How are annual and quarterly periods encoded?

### AI Grounding

AI output must be grounded in selected review context.

Risks:

- fluent but unsupported text,
- wrong period references,
- wrong indicator names,
- confusing multiple validations under one indicator,
- style mismatch with reviewer expectations.

Mitigations:

- user selection before drafting,
- structured context only,
- editable drafts,
- final overall edit screen,
- future team template or reviewer-specific style profiles.

### Frontend Complexity

The app is not just a form. It must reproduce a real data review workflow.

High-risk features:

- keyboard traversal across sector/validation/indicator,
- chart range and auto-scaling,
- table rightmost-period default scroll,
- multiple non-contiguous highlights,
- issues report history display,
- local state persistence.

### Deployment Constraints

Work computers may not run Vite build commands because IT blocks local package binaries.

This does not necessarily block use of the app if:

- frontend is built on an approved machine,
- Flask serves prebuilt static assets,
- reviewer computers only run Flask or an approved packaged runtime.

Still unresolved:

- approved build environment,
- Flask localhost permissions,
- static file runtime behavior,
- future packaging path.

## Failure Modes

The project can fail if:

- real data mapping is ambiguous,
- reviewers do not trust draft text,
- UI is slower than current workflow,
- state loss makes review progress unreliable,
- chart/table evidence does not match what reviewers need,
- deployment depends on tools blocked by IT,
- AI text cannot be made concise and evidence-grounded.

## Practical MVP Definition

MVP should prove:

- reviewer can traverse all flagged pairs,
- visited state is reliable,
- center panel provides enough evidence to decide,
- right panel supports keep/edit drafting,
- complete/no-issue flow works,
- kept/edited items merge by sector and indicator,
- mock data can later be swapped through Flask API mapping.
