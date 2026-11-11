import json
from pathlib import Path
from service.helpers.controller_helpers import ControllerException
from fastapi import APIRouter, HTTPException

router = APIRouter()


@router.get("/layer_data/")
async def get_layer_data():
    try:
        path = Path(__file__).parent.parent / 'data' / 'layer_data.json'
        with open(path, 'r') as f:
            return json.load(f)
    except ControllerException as e:
        raise HTTPException(status_code=400, detail=str(e))
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=500, detail="Internal server error")
