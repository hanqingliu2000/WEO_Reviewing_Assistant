from pathlib import Path

import pandas as pd

EXPORT_COLUMNS: list[tuple[str, str, type | str]] = [
    ("OBS_VALUE.ID", "obs_value", float),
    ("TIME_PERIOD.ID", "time_period", str),
    ("T_COMMENT.ID", "t_comment", str),
    ("DESK_SERIES.ID", "desk_series", str),
    ("INDICATOR_DESCRIPTION.ID", "indicator_description", str),
    ("INDICATOR_FORMULA.ID", "indicator_formula", str),
    ("DIAGNOSTIC.id", "diagnostic", str),
    ("FREQUENCY.id", "frequency", str),
    ("INDICATOR.id", "indicator", str),
    ("EXERCISE.id", "exercise", str),
    ("SCALE.id", "scale", "Int64"),
]

EXPORT_USECOLS = [source_name for source_name, _, _ in EXPORT_COLUMNS]
EXPORT_DTYPES = {source_name: dtype for source_name, _, dtype in EXPORT_COLUMNS}
EXPORT_RENAME_MAP = {source_name: target_name for source_name, target_name, _ in EXPORT_COLUMNS}
EXPORT_TEXT_COLUMNS = [target_name for _, target_name, dtype in EXPORT_COLUMNS if dtype == str]

def _normalize_export_columns(df: pd.DataFrame) -> pd.DataFrame:
    renamed = df.rename(columns=EXPORT_RENAME_MAP)
    renamed.loc[:, EXPORT_TEXT_COLUMNS] = renamed[EXPORT_TEXT_COLUMNS].where(
        renamed[EXPORT_TEXT_COLUMNS].notna(),
        None,
    )
    return renamed


def read_export_csv(csv_path: Path) -> pd.DataFrame:
    df = pd.read_csv(
        csv_path,
        na_values=["", "NaN"],
        usecols=EXPORT_USECOLS,
        dtype=EXPORT_DTYPES,
    )
    return _normalize_export_columns(df)
