from pathlib import Path

import pandas as pd

from weo_review_backend.features.review.types import IssuesReportMap

ISSUES_COLUMNS = [
    ("Indicator", "indicator"),
    ("Validation Type", "diagnostic"),
    ("Freq", "frequency"),
    ("Flagged Period", "t_comment"),
    ("Explaination", "explanation"),
]
ISSUES_USECOLS = [source_name for source_name, _ in ISSUES_COLUMNS]
ISSUES_RENAME_MAP = {
    source_name: target_name for source_name, target_name in ISSUES_COLUMNS
}
ISSUES_EXCLUDED_PATTERNS = [
    " - ",
    "Metadata Comments",
    "General Comments",
    "Additional Comments/MCDREO Validation Comments",
]
def _filter_issues_report(df: pd.DataFrame) -> pd.DataFrame:
    filtered = df.rename(columns=ISSUES_RENAME_MAP)
    excluded_mask = pd.Series(False, index=filtered.index)
    indicator_values = filtered["indicator"].fillna("")

    for pattern in ISSUES_EXCLUDED_PATTERNS:
        excluded_mask |= indicator_values.str.contains(pattern, regex=False)

    return filtered.loc[~excluded_mask].reset_index(drop=True)


def _build_issues_report_map(df: pd.DataFrame) -> IssuesReportMap:
    issues_report: IssuesReportMap = {}

    for indicator, diagnostic, frequency, t_comment, explanation in df[
        ["indicator", "diagnostic", "frequency", "t_comment", "explanation"]
    ].itertuples(index=False):
        if pd.notna(indicator) and pd.notna(diagnostic) and pd.notna(frequency):
            issues_report[(str(indicator), str(diagnostic), str(frequency))] = (
                None if pd.isna(t_comment) else str(t_comment),
                None if pd.isna(explanation) else str(explanation),
            )

    return issues_report


def load_issues_report(path: Path) -> IssuesReportMap:
    issues_report = pd.read_excel(
        path,
        sheet_name=0,
        header=7,
        usecols=ISSUES_USECOLS,
    )
    return _build_issues_report_map(_filter_issues_report(issues_report))
