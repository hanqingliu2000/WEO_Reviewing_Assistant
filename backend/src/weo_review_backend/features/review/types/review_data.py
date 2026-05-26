from dataclasses import dataclass

import pandas as pd

IssuesReportMap = dict[tuple[str, str, str], tuple[str | None, str | None]]
RelatedIndicatorsMap = dict[str, dict[str, str]]


@dataclass
class ExportDatasets:
    WEO_A: pd.DataFrame | None = None
    WEO_Q: pd.DataFrame | None = None
    MCDREO: pd.DataFrame | None = None
