import json
import logging
import os
from pathlib import Path

import httpx
from fastapi import APIRouter, Body, HTTPException

from mind_core.storage.atomic import atomic_write_json

logger = logging.getLogger(__name__)


def create_config_router(settings_dir: Path) -> APIRouter:
    router = APIRouter()

    @router.put("/config/indicators/{indicator_id}")
    async def update_indicator_config(indicator_id: str, config: dict = Body(...)):
        settings_dir.mkdir(parents=True, exist_ok=True)
        p = (settings_dir / f"{indicator_id}.json").resolve()
        if not p.is_relative_to(settings_dir.resolve()):
            raise HTTPException(status_code=400, detail="Invalid indicator ID")

        existing = json.loads(p.read_text()) if p.exists() else {}
        for key, value in config.items():
            if value is None:
                existing.pop(key, None)
            else:
                existing[key] = value
        atomic_write_json(p, existing)

        service_url = os.getenv("SERVICE_URL", "http://service:5000")
        try:
            async with httpx.AsyncClient() as client:
                resp = await client.put(
                    f"{service_url}/config/indicators/{indicator_id}",
                    json=config, timeout=10.0,
                )
            resp.raise_for_status()
            return resp.json()
        except Exception as e:
            logger.error("Failed to forward config to service: %s", e)
            raise HTTPException(status_code=502, detail="Failed to forward config to service")

    return router
