import asyncio
import json
import logging
import os
import re
from datetime import datetime, timezone, timedelta
from pathlib import Path

import uvicorn

from mind_core import create_app
from mind_core.onboarding.metadata_store import list_indicators, get_indicator
from config import build_config
from controllers.config import create_config_router

logger = logging.getLogger(__name__)
DATA_FILE_REGEX = re.compile(r'^(?P<country>.+)__(?P<channel>.+)__(?P<subgroup>.+)__(?P<version>.+)\.csv$')

config, ob_config = build_config()
SETTINGS_DIR = Path(ob_config.data_dir) / "settings"
app = create_app(config, ob_config=ob_config, title="SAEDashboard Mind")
app.include_router(create_config_router(SETTINGS_DIR))


@app.on_event("startup")
async def startup():
    _cleanup_dangling_sessions()

    import httpx
    indicators_dir = ob_config.indicators_dir
    service_url = os.getenv("SERVICE_URL", "http://service:5000")

    for _ in range(5):
        try:
            httpx.get(f"{service_url}/", timeout=5.0)
            break
        except Exception:
            await asyncio.sleep(2)
    else:
        return

    metadata_ids = set()
    for meta in list_indicators(ob_config.metadata_path):
        metadata_ids.add(meta.id)
        hidden_set = set(meta.hidden_countries)
        for csv_file in meta.csv_files:
            if "__" not in csv_file:
                continue
            csv_country = csv_file.split("__")[0]
            if csv_country in hidden_set:
                try:
                    httpx.post(f"{service_url}/indicators/deregister",
                               json={"indicator_id": meta.id, "permanent": False, "country": csv_country}, timeout=30.0)
                except Exception:
                    logger.warning("Failed to deregister hidden indicator %s for %s", meta.id, csv_country)
            else:
                path = indicators_dir / csv_file
                if not path.exists():
                    continue
                try:
                    with open(path, "rb") as f:
                        httpx.post(
                            f"{service_url}/indicators/register",
                            files={"file": (csv_file, f, "text/csv")},
                            data=meta.to_register_data(),
                            timeout=30.0,
                        )
                except Exception:
                    logger.warning("Failed to register %s", csv_file)

    for csv_path in indicators_dir.glob("*.csv"):
        m = DATA_FILE_REGEX.match(csv_path.name)
        if not m or m["channel"] in metadata_ids:
            continue
        logger.warning("Orphan CSV without metadata: %s (deleting)", csv_path.name)
        csv_path.unlink()

    if SETTINGS_DIR.is_dir():
        for f in SETTINGS_DIR.glob("*.json"):
            try:
                camel = json.loads(f.read_text())
                if camel:
                    httpx.put(f"{service_url}/config/indicators/{f.stem}",
                              json=camel, timeout=10.0)
            except Exception:
                logger.warning("Failed to push settings for %s", f.name)


def _cleanup_dangling_sessions():
    store = config.session_store
    linked = {m.source_upload_id for m in list_indicators(ob_config.metadata_path) if m.source_upload_id}
    cutoff = datetime.now(timezone.utc) - timedelta(days=30)
    removed = 0
    for s in list(store.list_all()):
        sid = s.session_id
        if sid in linked:
            continue
        if s.context.get("indicator_id") and get_indicator(ob_config.metadata_path, s.context["indicator_id"]):
            continue
        if s.updated_at:
            try:
                ts = datetime.fromisoformat(s.updated_at)
                if ts.tzinfo is None:
                    ts = ts.replace(tzinfo=timezone.utc)
                if ts > cutoff:
                    continue
            except ValueError:
                pass
        store.delete(sid)
        removed += 1
    if removed:
        logger.info("GC: removed %d dangling sessions", removed)


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=5020)
