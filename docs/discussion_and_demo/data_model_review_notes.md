# Data Model Review Notes

This file is for collecting review comments, concerns, and proposed changes about the frontend data model before we revise the implementation files.

Use this file when you want to point out problems or uncertainties without editing TypeScript directly. After comments are collected, Codex can apply them consistently across:

- `frontend/src/features/review/types/review.ts`
- `docs/development/mock_data_spec.md`
- `frontend/src/features/review/repo/mockReviewData.ts`
- future Flask API contract documents

## How To Use

For each type or field, write:

- **Concern**: what may be wrong, unclear, or incomplete.
- **Why it matters**: how it affects the UI, workflow, data mapping, AI drafting, or export.
- **Suggested direction**: optional. Leave blank if you are unsure.
- **Priority**: high / medium / low.

Example:

```md
### ReviewItem.flagged_periods

- Concern: This may need to support both annual periods and quarterly periods.
- Why it matters: The chart, table, keyboard navigation, and evidence export need consistent period handling.
- Suggested direction: Use string period keys for now, but document expected formats such as `2025` and `2025Q1`.
- Priority: high
```

## Open Design Questions

Use this section for broad questions that affect multiple types.

### Question 1

- Concern:
- Why it matters:
- Suggested direction:
- Priority:

### Question 2

- Concern:
- Why it matters:
- Suggested direction:
- Priority:

## ReviewSession

Top-level session metadata, country/submission state, and the full set of review items.

### ReviewSession

- Concern:
- Why it matters:
- Suggested direction:
- Priority:

### ReviewSession.country

- Concern:我们使用的country id有两种，一种是内部的numeric code，由三位数字组成，会在后端里准备好，还有一个满足一对一关系的国家iso code。 numeric code是主要在内部etl里流程发挥检索作用的，iso code是用于展示，在前端里应该用类似逻辑
- Why it matters:
- Suggested direction:
- Priority:

### ReviewSession.submission

- Concern:submission_id作为string应该足够了，可以用作识别submission的字段
- Why it matters:
- Suggested direction:
- Priority:

### ReviewSession.has_quarterly_data

- 我们的后端原始数据里有一个维度叫做frequency。has_quarterly_data应该取决于后端数据里是否有frequency=Q的data point.如果有，则该国家有quarterly data 否则只有annual data


### ReviewSession.review_item_ids

- Concern:
- Why it matters:
- Suggested direction:
- Priority:

## ReviewItem

Lightweight navigation item for one selectable `sector + validation + indicator` pair.

### ReviewItem

- Concern:这个item里的label是否可以改名为name
- Why it matters:
- Suggested direction:
- Priority:

### ReviewItem.sector_code / sector_label

- Concern:ector code是否叫做sector_code更好，和其他field保持一致性
- Why it matters:
- Suggested direction:
- Priority:

### ReviewItem.severity

- Concern:注意severity是唯一取决于validation type的，和indicator没有关系
- Why it matters:
- Suggested direction:
- Priority:

### ReviewItem.validation_id / validation_label

- Concern:
- Why it matters:
- Suggested direction:
- Priority:

### ReviewItem.indicator_id / indicator_label

- Concern:
- Why it matters:
- Suggested direction:
- Priority:

### ReviewItem.flagged_periods

- Concern:flagged_periods和flagged_data_point_count在后端数据源里是作为文本粘贴在一起的，提供给前端时将需要进行拆分保存
- Why it matters:
- Suggested direction:
- Priority:

### ReviewItem.has_published / has_related_indicators / is_quarterly

- Concern:
- Why it matters:
- Suggested direction:
- Priority:

## ReviewItemDetail

Full payload for the active review item and the center review surface.

### ReviewItemDetail

- Concern:
- Why it matters:
- Suggested direction:
- Priority:

### validation_explanation / recommended_action

- Concern:explanation和recoomended_action在数据源里是写在一起的，在前端也不需要分开。注意此处的explanation和issues report里的explanation是两个完全不同的东西，为了便于区分可以在这里统一称为recommended_action
- Why it matters:
- Suggested direction:
- Priority:

### rule_name / rule_description

- Concern:rule可以改为validation
- Why it matters:
- Suggested direction:
- Priority:

### descriptor / formula / desk_series

- Concern:
- Why it matters:
- Suggested direction:
- Priority:

### metadata

- Concern:不确定这个metadata指什么
- Why it matters:
- Suggested direction:
- Priority:

### series.current / series.previous / series.published

- Concern:
- Why it matters:
- Suggested direction:
- Priority:

## TimeSeriesPoint

One chart/table data point.

### TimeSeriesPoint

- Concern:
- Why it matters:
- Suggested direction:
- Priority:

### period

- Concern:
- Why it matters:
- Suggested direction:
- Priority:

### value

- Concern:
- Why it matters:
- Suggested direction:
- Priority:

### is_flagged / change_type / note

- Concern:不能叫做chang_type 应该叫做validation_type，因为这里显示的是所有validation 不仅仅是change。理论上不需要额外note
- Why it matters:
- Suggested direction:
- Priority:

## IssueReportEntry

Historical explanation or confirmation for a validation + indicator pair.

### IssueReportEntry

- Concern:
- Why it matters:
- Suggested direction:
- Priority:

### period_start / period_end

- Concern:不需要区分start和end period以一个xxxx-xxxx的字符串出现
- Why it matters:
- Suggested direction:
- Priority:

### explanation

- Concern:
- Why it matters:
- Suggested direction:
- Priority:

### confirmed_by / confirmed_at

- Concern:，不需要confirmed——by或者confimed——at，都会在explanation一个字段里显示
- Why it matters:
- Suggested direction:
- Priority:

## RelatedIndicatorRow

Related indicators shown for the active indicator.

### RelatedIndicatorRow

- Concern:这个定义比较tricky。在原数据中我们有一个mapping，其中的report indicator会对应多个involved indicator。每一个involved indicator的需要的结构和正常的indicator完全一致，也有indicator_id, indicator_name等属性，也是一个time series，这里只用来表示一种关系
- Why it matters:
- Suggested direction:
- Priority:

### relationship_type

- Concern:不需要定义relationship-type，indicator之间的关系就只是“related"，当report indicator在左侧filter被选中，involved indictaor就显示在底部的related indicator table里
- Why it matters:
- Suggested direction:
- Priority:

### values

- Concern:
- Why it matters:
- Suggested direction:
- Priority:

## DraftSnippet

AI-generated and user-edited text for one selected pair.

### DraftSnippet

- Concern:
- Why it matters:
- Suggested direction:
- Priority:

### ai_text / user_edited_text

- Concern:
- Why it matters:
- Suggested direction:
- Priority:

### status

- Concern:
- Why it matters:
- Suggested direction:
- Priority:

## EvidenceSelection

Evidence settings, display range, export range, and highlights for one pair.

### EvidenceSelection

- Concern:
- Why it matters:
- Suggested direction:
- Priority:

### include_line_chart / include_current_data_table / include_related_indicator_table

- Concern:
- Why it matters:
- Suggested direction:
- Priority:

### display_time_range / evidence_range

- Concern:
- Why it matters:
- Suggested direction:
- Priority:

### temporary_highlights / saved_highlights

- Concern:
- Why it matters:
- Suggested direction:
- Priority:

## Highlight

One temporary or saved chart/table highlight.

### Highlight

- Concern:highlight应该保留可以多种形态的选项，比如高亮，实线外框
- Why it matters:
- Suggested direction:
- Priority:

### target

- Concern:
- Why it matters:
- Suggested direction:
- Priority:

### period_start / period_end / row_id / column_id

- Concern:
- Why it matters:
- Suggested direction:
- Priority:

### style / note

- Concern:
- Why it matters:
- Suggested direction:
- Priority:

## EmailDraftOutput

Final merged output after completing the review.

### EmailDraftOutput

- Concern:
- Why it matters:
- Suggested direction:
- Priority:

### sector_groups

- Concern:
- Why it matters:
- Suggested direction:
- Priority:

### indicator_groups

- Concern:
- Why it matters:
- Suggested direction:
- Priority:

## Flask API Boundary

Use this section for comments about how the frontend types should map to future Flask responses.

### Endpoint shape

- Concern:
- Why it matters:
- Suggested direction:
- Priority:

### Local state persistence

- Concern:
- Why it matters:
- Suggested direction:
- Priority:

### Export and evidence generation

- Concern:
- Why it matters:
- Suggested direction:
- Priority:
