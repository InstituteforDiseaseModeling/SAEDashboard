import json
import logging
from pathlib import Path
from typing import Optional

from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from pydantic import BaseModel

from service.helpers.controller_helpers import MASTER_DATA_FILE_REGEX, data_dir, clear_data_cache
from service.helpers.csv_validator import validate_indicator_csv
from service.helpers.indicator_metadata import save_metadata, delete_metadata, get_metadata, DISPLAY_FIELD_MAP

logger = logging.getLogger(__name__)
router = APIRouter()


class DeregisterRequest(BaseModel):
    indicator_id: str
    permanent: bool = False
    country: str


@router.post("/indicators/register")
async def register_indicator(
    file: UploadFile = File(...),
    display_name: Optional[str] = Form(None),
    color_theme: Optional[str] = Form(None),
    shape_version: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    display_config: Optional[str] = Form(None),
):
    filename = file.filename
    if not filename or not MASTER_DATA_FILE_REGEX.match(filename):
        raise HTTPException(
            status_code=400,
            detail=f"Filename '{filename}' does not match pattern: "
                   "{{Country}}__{{Indicator}}__{{Subgroup}}__{{Version}}.csv",
        )
    content = await file.read()
    if len(content) == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    parsed_display_config = None
    if display_config:
        try:
            parsed_display_config = json.loads(display_config)
        except json.JSONDecodeError:
            raise HTTPException(status_code=400, detail="display_config is not valid JSON")
        if not isinstance(parsed_display_config, dict):
            raise HTTPException(status_code=400, detail="display_config must be a JSON object")
        unknown = set(parsed_display_config.keys()) - set(DISPLAY_FIELD_MAP.keys())
        if unknown:
            raise HTTPException(status_code=400, detail=f"Unknown display_config keys: {sorted(unknown)}")

    dest_path = Path(data_dir) / filename
    tmp_path = dest_path.with_suffix('.csv.tmp')

    try:
        tmp_path.write_bytes(content)
        issues = validate_indicator_csv(tmp_path)
        if issues:
            tmp_path.unlink()
            raise HTTPException(status_code=400, detail={"message": "CSV content validation failed", "issues": issues})
        if dest_path.exists() and dest_path.read_bytes() != content:
            tmp_path.unlink()
            raise HTTPException(
                status_code=409,
                detail=f"File '{filename}' already exists with different content. "
                       "Bump the version, pick a different indicator id, or deregister first.",
            )
        tmp_path.replace(dest_path)
    except HTTPException:
        raise
    except OSError as e:
        if tmp_path.exists():
            tmp_path.unlink()
        raise HTTPException(status_code=500, detail=f"Failed to write file: {e}")

    indicator_id = MASTER_DATA_FILE_REGEX.match(filename)["channel"]
    existing = get_metadata(indicator_id)
    if existing:
        metadata_fields = {
            "display_name": display_name,
            "description": description,
        }
    else:
        metadata_fields = {
            "display_name": display_name,
            "color_theme": color_theme,
            "shape_version": shape_version,
            "description": description,
        }
        if parsed_display_config:
            metadata_fields.update(parsed_display_config)
    if any(v is not None for v in metadata_fields.values()):
        save_metadata(indicator_id, **metadata_fields)

    clear_data_cache(filename)
    logger.info(f"Registered indicator file: {filename} ({len(content)} bytes)")
    return {"status": "ok", "filename": filename, "bytes": len(content)}


@router.post("/indicators/deregister")
async def deregister_indicator(body: DeregisterRequest):
    removed = []
    for f in Path(data_dir).glob("*.csv"):
        m = MASTER_DATA_FILE_REGEX.match(f.name)
        if m and m["channel"] == body.indicator_id and m["country"] == body.country:
            clear_data_cache(f.name)
            f.unlink()
            removed.append(f.name)
    if not removed:
        raise HTTPException(status_code=404, detail=f"No files found for indicator '{body.indicator_id}'")
    if body.permanent:
        delete_metadata(body.indicator_id)
    logger.info(f"Deregistered indicator: {body.indicator_id}, removed {len(removed)} files")
    return {"status": "ok", "removed": removed}
