import pandas as pd

from weo_review_backend.features.review.types import ExportDatasets


DATASET_FILTERS: dict[str, tuple[str, str | None]] = {
    "WEO_A": ("WEO", "A"),
    "WEO_Q": ("WEO", "Q"),
    "MCDREO": ("MCDREO", None),
}

PIVOT_INDEX = [
    "t_comment",
    "desk_series",
    "indicator_description",
    "indicator_formula",
    "diagnostic",
    "frequency",
    "indicator",
    "exercise",
    "scale",
]


def _drop_empty_time_period_rows(df: pd.DataFrame) -> pd.DataFrame:
    empty_time_period_rows = df["time_period"].isna()
    return df.loc[~empty_time_period_rows]


def _pivot_time_period(df: pd.DataFrame) -> pd.DataFrame:
    filtered_df = _drop_empty_time_period_rows(df)
    df_pivot = filtered_df.pivot(
        index=PIVOT_INDEX,
        columns="time_period",
        values="obs_value",
    )
    df_pivot.columns.name = None
    return df_pivot.reset_index()


def build_export_datasets(df: pd.DataFrame) -> ExportDatasets:
    datasets = ExportDatasets()

    for dataset_name, (exercise, frequency) in DATASET_FILTERS.items():
        dataset_filter = df["exercise"].eq(exercise)
        if frequency is not None:
            dataset_filter &= df["frequency"].eq(frequency)

        dataset_df = df.loc[dataset_filter]
        if not dataset_df.empty:
            setattr(datasets, dataset_name, _pivot_time_period(dataset_df))

    return datasets
