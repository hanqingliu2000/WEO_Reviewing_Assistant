import configparser
from dataclasses import dataclass
from functools import lru_cache
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parents[5]
CONFIG_PATH = REPO_ROOT / "config.ini"


@dataclass(frozen=True)
class Paths:
    exports_root: Path
    data_root: Path
    issues_reports_root: Path
    indicator_metadata_root: Path
    weo_validations_root: Path
    mcdreo_validations_root: Path


@lru_cache(maxsize=1)
def load_paths() -> Paths:
    config = configparser.ConfigParser()
    if not config.read(CONFIG_PATH):
        raise FileNotFoundError(f"Config file not found: {CONFIG_PATH}")

    paths_config = config["paths"]
    return Paths(
        exports_root=Path(paths_config["exports_root"]),
        data_root=Path(paths_config["data_root"]),
        issues_reports_root=Path(paths_config["issues_reports_root"]),
        indicator_metadata_root=Path(paths_config["indicator_metadata_root"]),
        weo_validations_root=Path(paths_config["weo_validations_root"]),
        mcdreo_validations_root=Path(paths_config["mcdreo_validations_root"]),
    )
