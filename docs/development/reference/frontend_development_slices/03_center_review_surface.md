# Slice 03: Center Review Surface

## Goal

Render the center review surface for one active mock review item.

The center surface should feel like the main data-review workspace, not a metadata card. Context and draft explanation that belong to the reviewer response live in the right panel.

## Include

- current/previous/published-when-present table at the top of the center panel,
- resizable `Series` column in the top current/previous/published table,
- compact table period columns,
- header-level decimal-place controls shared by all center tables,
- indicator code, indicator name, and desk series shown together inside the line chart frame as the chart title area,
- formula displayed inside the line chart container at the top,
- ECharts line chart,
- chart-level x-axis slider controlling only the line chart viewport,
- related indicators table below the line chart,
- related indicators table columns for indicator, descriptor, then period values,
- resizable indicator and descriptor columns in the related indicators table,
- user-resizable related indicators table height,
- empty state for indicators with no related indicators,
- internal center-panel scrolling when content exceeds the available viewport height.

## Exclude

- active breadcrumb/context box above the center surface,
- recommended action block in the center surface,
- flagged-period metadata block in the center surface,
- issues report / desk explanation panel in the center surface,
- year-range slicer above the main table,
- saved highlight state,
- real export,
- real backend data.

## Rules

- Center visual order is:
  1. current/previous/published-when-present table,
  2. line chart frame containing indicator code/name, desk series, formula, and chart,
  3. related indicators table.
- Current and previous series show by default.
- Published is optional in the data. If it exists, display it directly with current and previous; no options menu is required for this slice.
- Current line color is `#e66c37` and should render above the other lines.
- Previous line color is `#0d6abf` and should render between current and published.
- Published line color is light grey and should render below current and previous.
- Chart point markers should be small, solid circles.
- The chart should not zoom on ordinary mouse-wheel or vertical trackpad scrolling; only the explicit chart x-axis slider changes chart viewport.
- Main and related indicator tables should use compact period columns to show as many periods as practical.
- Main and related indicator tables should reserve bottom space so horizontal scrollbars do not overlap table content.
- Main and related indicator tables should default-scroll to the newest/rightmost period.
- The top table `Series` column should resize within a modest range so it does not consume unnecessary period-column space.
- Indicator code should use a stronger title treatment, with more visual weight than table/navigation labels.
- Indicator code and indicator name should have enough vertical padding and spacing to read as the chart title area rather than table text.
- Decimal-place controls live in the top `SessionHeader`, next to settings, and apply to the main and related tables.
- The main table does not need its own top control row.
- Annual chart/table mock data should cover 1980-2031 by default.
- Quarterly chart/table mock data should cover 1990Q1-2027Q4 by default.
- Related indicators filter by indicator only.
- Mock related indicators should cover realistic row counts, generally 2-8 rows when related indicators exist.
- Related indicators table indicator and descriptor columns should resize by dragging their column borders, without extra visible double separator bars. The current resize interaction is sufficient for this slice and does not require further refinement now.
- Related indicators table height should be manually resizable. Its minimum height should show about two rows, and when more than four rows exist the table should scroll internally rather than expanding the whole page.
- If no related indicators exist, show a compact empty state inside the related indicators table instead of leaving a blank area.
- Additional y-axis range padding refinement is not required for this slice.

## Acceptance

- Mock item renders enough data context for review.
- Table is visually positioned above the line chart.
- The line chart frame contains the indicator code/title, indicator name/subtitle, desk series, formula, and chart in one component-level evidence region so screenshot/export logic can capture them together.
- Same indicator under multiple validations shares chart/table series.
- Explanation and flagged periods can differ by validation, but are not displayed as center metadata blocks.
- Missing published data is handled cleanly.
- Empty related indicators state is handled.
