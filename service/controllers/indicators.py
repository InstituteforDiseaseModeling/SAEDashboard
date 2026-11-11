from collections import Counter
from pathlib import Path
import yaml
from service.helpers.controller_helpers import (
    get_indicator_admin_levels, read_shape_version, get_indicator_version,
    ControllerException, read_dot_names, get_channels, read_admin_level,
    read_use_descendant_dot_names, get_indicator_time, get_indicator_subgroups,
    get_shape_filenames, get_all_countries,
)
from service.helpers.dot_name import DotName
from service.helpers.indicator_metadata import get_metadata, build_display_config
from service.schemas.IndicatorsSchema import IndicatorsListSchema
from fastapi import APIRouter, Request, HTTPException

router = APIRouter()

_config_path = Path(__file__).parent.parent / 'config.yaml'


def generate_label(indicator):
    meta = get_metadata(indicator)
    if meta and meta.get("display_name"):
        return meta["display_name"]
    with open(_config_path, "r") as f:
        config = yaml.safe_load(f)
    labels = config.get("indicator_labels", {})
    return labels.get(indicator, " ".join(p.capitalize() for p in indicator.split('_')))


@router.get("/indicators", response_model=IndicatorsListSchema, response_model_exclude_none=True)
async def get_indicators(request: Request):
    try:
        dot_names = read_dot_names(request=request)
        if len(dot_names) > 1:
            raise HTTPException(status_code=400, detail="indicators can only be requested for one dot_name at a time.")
        dot_name = DotName(dot_name_str=dot_names[0])
        use_descendant_dot_names = read_use_descendant_dot_names(request=request)
        requested_admin_level = read_admin_level(request=request, required=False)
        if requested_admin_level is not None and requested_admin_level < dot_name.admin_level:
            raise HTTPException(status_code=400, detail="Cannot request an admin_level shallower than the provided dot_name.")

        indicators = sorted(get_channels(dot_name=dot_name, use_descendent_dot_names=use_descendant_dot_names, admin_level=requested_admin_level))
        countries = get_all_countries() if dot_name.country is None else [dot_name.country]
        result = []
        for ind in indicators:
            all_subgroups = set()
            all_admin_levels = set()
            all_shape_levels = set()
            data_time = {}
            country_versions = {}
            for country in countries:
                try:
                    sv = get_indicator_version(country, ind)
                except (HTTPException, ControllerException):
                    continue
                country_versions[country] = sv
                all_subgroups.update(get_indicator_subgroups(country, ind, sv))
                all_admin_levels.update(get_indicator_admin_levels(country=country, channel=ind, version=sv))
                all_shape_levels.update(int(m['admin_level']) for m in get_shape_filenames(country=country, version=sv))
                for subgroup in (get_indicator_subgroups(country, ind, sv) or ['all']):
                    try:
                        subgroup_time = get_indicator_time(country=country, channel=ind, subgroup=subgroup, version=sv)
                    except (HTTPException, ControllerException):
                        continue
                    for year, months in subgroup_time.items():
                        data_time.setdefault(year, []).extend(months)
            if not country_versions:
                continue
            shape_version = Counter(country_versions.values()).most_common(1)[0][0]
            subgroups = sorted(all_subgroups | {"all"})
            admin_levels = sorted(all_admin_levels & all_shape_levels)
            label = generate_label(ind)
            meta = get_metadata(ind)
            color_theme = meta.get("color_theme") if meta else None
            entry = {"id": ind, "text": label, "version": shape_version, "admin_levels": admin_levels, "subgroups": list(subgroups), "time": data_time}
            if len(country_versions) > 1:
                entry["country_versions"] = country_versions
            if color_theme:
                entry["color_theme"] = color_theme
            config = build_display_config(meta)
            config["shapefileVersion"] = shape_version
            if color_theme:
                config["theme"] = color_theme
            entry["config"] = config
            result.append(entry)
        return {"indicators": result}
    except ControllerException as e:
        raise HTTPException(status_code=400, detail=str(e))
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=500, detail="Internal server error")
