from service.helpers.controller_helpers import load_geojson_pickle
from fastapi import APIRouter, Request

router = APIRouter()


@router.get("/africa_map/")
async def get_africa_map(request: Request):
    admin_level = int(request.query_params.get("admin_level", 1))
    version = int(request.query_params.get("shape_version", 1))
    filename = f"Africa__l{admin_level}__{version}.shp.pickle"
    geojson_dicts = load_geojson_pickle(filename)
    if not geojson_dicts:
        return {"Africa": {"type": "FeatureCollection", "features": []}}
    features = [feat for feat in geojson_dicts.values()]
    return {"Africa": {"type": "FeatureCollection", "features": features}}
