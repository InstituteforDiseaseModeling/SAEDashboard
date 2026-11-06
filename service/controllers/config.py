from service.helpers.controller_helpers import (
    ControllerException, get_app_config, get_all_indicator_configs, get_indicator_config,
)
from service.helpers.indicator_metadata import save_display_config
from service.schemas.ConfigSchema import AppConfigSchema, FullConfigSchema, IndicatorConfigSchema
from fastapi import APIRouter, HTTPException

router = APIRouter()


@router.get("/config", response_model=FullConfigSchema, response_model_exclude_none=True)
async def get_config():
    try:
        return {"app": get_app_config(), "indicators": get_all_indicator_configs()}
    except ControllerException as e:
        raise HTTPException(status_code=400, detail=str(e))
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=500, detail="Internal server error")


@router.put("/config/indicators/{indicator}", response_model=IndicatorConfigSchema,
            response_model_exclude_none=True)
async def update_indicator_config(indicator: str, config: IndicatorConfigSchema):
    try:
        if indicator not in get_all_indicator_configs():
            raise HTTPException(status_code=404, detail=f"Unknown indicator: {indicator}")
        save_display_config(indicator, config.model_dump(exclude_unset=True))
        return get_indicator_config(indicator)
    except ControllerException as e:
        raise HTTPException(status_code=400, detail=str(e))
    except HTTPException:
        raise
    except OSError as e:
        raise HTTPException(status_code=500, detail=f"Failed to write indicator metadata: {e}")
    except Exception:
        raise HTTPException(status_code=500, detail="Internal server error")
