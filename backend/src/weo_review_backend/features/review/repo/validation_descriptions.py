from pathlib import Path

import pandas as pd

from weo_review_backend.shared.config import load_paths

WEO_SHEET_NAME = "Description_Expand"
MCDREO_SHEET_NAME = "Description_MCDREO_Expand"
WEO_VALIDATIONS_FILENAME = "WEO Validations.xlsx"
MCDREO_VALIDATIONS_FILENAME = "MCDREO Validations.xlsx"
INDICATOR_COLUMN = "Indicator(s)"
SEVERITY_DIAGNOSTIC_COLUMN = "Severity: Validation"
DESCRIPTION_COLUMN = "Explanation"


def _load_validations_path(filename: str) -> Path:
    paths = load_paths()
    if filename == WEO_VALIDATIONS_FILENAME:
        return paths.weo_validations_root / filename
    return paths.mcdreo_validations_root / filename


def _parse_severity_diagnostic(value: str) -> tuple[str, str]:
    severity, _, diagnostic = value.partition(":")
    parsed_severity = severity.strip()
    parsed_diagnostic = diagnostic.strip()
    return parsed_severity.upper(), parsed_diagnostic.upper()


def _build_validation_description_map(
    df: pd.DataFrame,
) -> dict[tuple[str, str], tuple[str, str]]:
    filtered_df = df[
        df[INDICATOR_COLUMN].notna()
        & df[INDICATOR_COLUMN].ne("")
        & df[SEVERITY_DIAGNOSTIC_COLUMN].notna()
        & df[SEVERITY_DIAGNOSTIC_COLUMN].ne("")
        & df[DESCRIPTION_COLUMN].notna()
        & df[DESCRIPTION_COLUMN].ne("")
    ].copy()

    validation_description: dict[tuple[str, str], tuple[str, str]] = {}
    for row in filtered_df[
        [INDICATOR_COLUMN, SEVERITY_DIAGNOSTIC_COLUMN, DESCRIPTION_COLUMN]
    ].itertuples(index=False):
        indicator, severity_diagnostic, description = row
        severity, diagnostic = _parse_severity_diagnostic(severity_diagnostic)
        if indicator and diagnostic and description:
            validation_description[(str(indicator), str(diagnostic))] = (
                str(severity),
                str(description),
            )

    return validation_description


def _load_validation_descriptions_sheet(path: Path, sheet_name: str) -> pd.DataFrame:
    df = pd.read_excel(
        path,
        sheet_name=sheet_name,
        usecols=[
            INDICATOR_COLUMN,
            SEVERITY_DIAGNOSTIC_COLUMN,
            DESCRIPTION_COLUMN,
        ],
        dtype=str,
    )
    return df


def load_weo_validation_descriptions() -> dict[tuple[str, str], tuple[str, str]]:
    df = _load_validation_descriptions_sheet(
        _load_validations_path(WEO_VALIDATIONS_FILENAME),
        WEO_SHEET_NAME,
    )
    return _build_validation_description_map(df)


def load_mcdreo_validation_descriptions() -> dict[tuple[str, str], tuple[str, str]]:
    df = _load_validation_descriptions_sheet(
        _load_validations_path(MCDREO_VALIDATIONS_FILENAME),
        MCDREO_SHEET_NAME,
    )
    return _build_validation_description_map(df)
