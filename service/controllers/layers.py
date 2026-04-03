import os

from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import FileResponse

from service.helpers.controller_helpers import (
    ControllerException, get_data_filenames, open_layer_csv, LAYER_DATA_DIR
)
from service.schemas.LayersSchema import LayersListSchema, LayerDataResponse

router = APIRouter()


def _generate_label(layer_id: str) -> str:
    return " ".join(p.capitalize() for p in layer_id.split("_"))


def _image_layers() -> dict[str, str]:
    """Return {layer_id: filepath} for all .png files in LAYER_DATA_DIR."""
    result = {}
    for fn in os.listdir(LAYER_DATA_DIR):
        if fn.lower().endswith(".png"):
            layer_id = fn[:-4]  # strip .png
            result[layer_id] = os.path.join(LAYER_DATA_DIR, fn)
    return result


@router.get("/list_layers", response_model=LayersListSchema)
async def list_layers():
    try:
        # Point-data layers from CSVs
        matches = get_data_filenames(country=None, data_dir=LAYER_DATA_DIR)
        layer_years: dict[str, list[str]] = {}
        for m in matches:
            lid = m["channel"]
            year = m["subgroup"]
            if lid not in layer_years:
                layer_years[lid] = []
            if year != "all":
                layer_years[lid].append(year)

        layers = [
            {
                "id": lid,
                "type": "point-data",
                "label": _generate_label(lid),
                "years": sorted(layer_years[lid]),
            }
            for lid in sorted(layer_years)
        ]

        # Image layers from .png files
        for lid in sorted(_image_layers()):
            layers.append({
                "id": lid,
                "type": "image",
                "label": _generate_label(lid),
                "years": [],
            })

        return {"layers": layers}
    except ControllerException as e:
        raise HTTPException(status_code=400, detail=str(e))
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get("/layer", response_model=LayerDataResponse)
async def get_layer(id: str = Query(..., description="Layer id from /list_layers")):
    try:
        # Check image layers first
        images = _image_layers()
        if id in images:
            return {
                "id": id,
                "type": "image",
                "label": _generate_label(id),
                "data": None,
                "url": f"/layer/download?id={id}",
            }

        # Point-data layer
        data = open_layer_csv(None, id)
        return {"id": id, "type": "point-data", "label": _generate_label(id), "data": data, "url": None}
    except ControllerException as e:
        raise HTTPException(status_code=404, detail=str(e))
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get("/layer/download")
async def download_layer(id: str = Query(..., description="Layer id of an image layer")):
    images = _image_layers()
    if id not in images:
        raise HTTPException(status_code=404, detail=f"No image layer found for id '{id}'")
    return FileResponse(images[id], media_type="image/png", filename=f"{id}.png")
