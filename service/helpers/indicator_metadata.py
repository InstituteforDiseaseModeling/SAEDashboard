import json
from pathlib import Path

from service.helpers.controller_helpers import data_dir

_METADATA_PATH = Path(data_dir).parent / "indicator_metadata.json"


def _load() -> dict[str, dict]:
    if _METADATA_PATH.exists():
        return json.loads(_METADATA_PATH.read_text())
    return {}


def _save(data: dict[str, dict]):
    _METADATA_PATH.parent.mkdir(parents=True, exist_ok=True)
    tmp = _METADATA_PATH.with_suffix(".tmp")
    tmp.write_text(json.dumps(data, indent=2))
    tmp.replace(_METADATA_PATH)


def get_all_metadata() -> dict[str, dict]:
    return _load()


def get_metadata(indicator_id: str) -> dict | None:
    return _load().get(indicator_id)


def aggregation_method(indicator_id: str) -> str:
    meta = get_metadata(indicator_id) or {}
    return 'sum' if meta.get('use_avg') is False else 'mean'


def save_metadata(indicator_id: str, **fields):
    data = _load()
    entry = data.get(indicator_id, {})
    for key, value in fields.items():
        if value is not None:
            entry[key] = value
    data[indicator_id] = entry
    _save(data)


DISPLAY_FIELD_MAP = {
    "unit_label": "unitLabel",
    "multiplier": "multiper",
    "unit": "unit",
    "map_label": "mapLabel",
    "decimal_pt": "decimalPt",
    "legend_label": "legendLabel",
    "use_avg": "useAvg",
    "chart_type": "chartType",
    "main_species_name": "mainSpeciesName",
    "raster_file": "rasterFile",
    "extra_info": "extraInfo",
    "extra_info_en": "extraInfoEn",
    "extra_info_fr": "extraInfoFr",
    "y_axis_label": "yAxisLabel",
    "ignore_others": "ignoreOthers",
    "data_source_en": "dataSourceEn",
    "data_source_fr": "dataSourceFr",
    "group": "group",
    "group_order": "groupOrder",
}

CONFIG_FIELD_MAP = {
    **{camel: snake for snake, camel in DISPLAY_FIELD_MAP.items()},
    "theme": "color_theme",
    "shapefileVersion": "shape_version",
}


def save_display_config(indicator_id: str, config: dict) -> dict:
    data = _load()
    entry = data.get(indicator_id, {})
    for camel, value in config.items():
        key = CONFIG_FIELD_MAP.get(camel)
        if key is None:
            continue
        if value is None:
            entry.pop(key, None)
        else:
            entry[key] = value
    data[indicator_id] = entry
    _save(data)
    return entry


def build_display_config(meta: dict | None) -> dict:
    config = {}
    if not meta:
        return config
    for src, dst in DISPLAY_FIELD_MAP.items():
        value = meta.get(src)
        if value is not None:
            config[dst] = value
    return config


def delete_metadata(indicator_id: str):
    data = _load()
    if indicator_id in data:
        del data[indicator_id]
        _save(data)
