from pathlib import Path

from weo_review_backend.features.review.repo import read_export_csv
from weo_review_backend.features.review.repo import load_issues_report as load_issues_report_from_repo
from weo_review_backend.features.review.repo import (
    load_mcdreo_related_indicators as load_mcdreo_related_indicators_from_repo,
)
from weo_review_backend.features.review.repo import (
    load_mcdreo_validation_descriptions as load_mcdreo_validation_descriptions_from_repo,
)
from weo_review_backend.features.review.repo import load_weo_related_indicators as load_weo_related_indicators_from_repo
from weo_review_backend.features.review.repo import (
    load_weo_validation_descriptions as load_weo_validation_descriptions_from_repo,
)
from weo_review_backend.features.review.service.export_transform import build_export_datasets
from weo_review_backend.features.review.types import ExportDatasets, IssuesReportMap, RelatedIndicatorsMap


def load_export_datasets(path: Path) -> ExportDatasets:
    return build_export_datasets(read_export_csv(path))


def load_issues_report(path: Path) -> IssuesReportMap:
    return load_issues_report_from_repo(path)


def load_weo_related_indicators() -> RelatedIndicatorsMap:
    return load_weo_related_indicators_from_repo()


def load_mcdreo_related_indicators() -> RelatedIndicatorsMap:
    return load_mcdreo_related_indicators_from_repo()


def load_weo_validation_descriptions() -> dict[tuple[str, str], tuple[str, str]]:
    return load_weo_validation_descriptions_from_repo()


def load_mcdreo_validation_descriptions() -> dict[tuple[str, str], tuple[str, str]]:
    return load_mcdreo_validation_descriptions_from_repo()
