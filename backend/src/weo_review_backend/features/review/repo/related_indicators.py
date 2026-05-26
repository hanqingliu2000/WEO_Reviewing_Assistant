from pathlib import Path

import pandas as pd

from weo_review_backend.features.review.types import RelatedIndicatorsMap
from weo_review_backend.shared.config import load_paths

WEO_DATA_CHECKS_SHEET_NAME = "DATA CHECKS"
MCDREO_DATA_CHECKS_SHEET_NAME = "MCDREO DATA CHECKS"
INDICATOR_DESCRIPTION_FILENAME = "Indicator_Description.xlsx"
REPORT_INDICATOR_COLUMN = "REPORT_INDICATOR"
INVOLVED_INDICATOR_COLUMN = "INVOLVED_INDICATOR"
WEO_DESCRIPTION_COLUMN = "WEO DESCRIPTOR"
MCDREO_DESCRIPTION_COLUMN = "DESCRIPTION"
def _load_indicator_description_path() -> Path:
    paths = load_paths()
    return paths.indicator_metadata_root / INDICATOR_DESCRIPTION_FILENAME


def _load_related_indicators_sheet(
    path: Path,
    sheet_name: str,
    description_column: str,
) -> RelatedIndicatorsMap:
    use_columns = [
        REPORT_INDICATOR_COLUMN,
        INVOLVED_INDICATOR_COLUMN,
        description_column,
    ]
    df = pd.read_excel(
        path,
        sheet_name=sheet_name,
        usecols=use_columns,
        dtype=str,
    )

    df[REPORT_INDICATOR_COLUMN] = df[REPORT_INDICATOR_COLUMN].str.strip()
    df[INVOLVED_INDICATOR_COLUMN] = df[INVOLVED_INDICATOR_COLUMN].str.strip()
    df = df[
        df[REPORT_INDICATOR_COLUMN].notna()
        & df[INVOLVED_INDICATOR_COLUMN].notna()
        & df[description_column].notna()
    ].copy()

    related_indicators: RelatedIndicatorsMap = {}
    for report_indicator_value, group in df.groupby(
        REPORT_INDICATOR_COLUMN, sort=False
    ):
        report_indicator_key = str(report_indicator_value)
        involved_descriptions: dict[str, str] = {}

        for row in group[[INVOLVED_INDICATOR_COLUMN, description_column]].itertuples(
            index=False
        ):
            involved_indicator, description = row
            involved_descriptions[str(involved_indicator)] = str(description)

        related_indicators[report_indicator_key] = involved_descriptions

    return related_indicators


def load_weo_related_indicators() -> RelatedIndicatorsMap:
    return _load_related_indicators_sheet(
        _load_indicator_description_path(),
        WEO_DATA_CHECKS_SHEET_NAME,
        WEO_DESCRIPTION_COLUMN,
    )


def load_mcdreo_related_indicators() -> RelatedIndicatorsMap:
    return _load_related_indicators_sheet(
        _load_indicator_description_path(),
        MCDREO_DATA_CHECKS_SHEET_NAME,
        MCDREO_DESCRIPTION_COLUMN,
    )
