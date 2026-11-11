import logging
import os
from pathlib import Path

from mind_core.onboarding.metadata_store import IndicatorMetadata

logger = logging.getLogger(__name__)
SERVICE_URL = os.getenv("SERVICE_URL", "http://service:5000")


def register_with_service(csv_path: Path, meta: IndicatorMetadata) -> str | None:
    import httpx
    try:
        with open(csv_path, "rb") as f:
            resp = httpx.post(
                f"{SERVICE_URL}/indicators/register",
                files={"file": (csv_path.name, f, "text/csv")},
                data=meta.to_register_data(),
                timeout=30.0,
            )
        if resp.status_code == 200:
            return None
        return f"WARNING: Failed to register (HTTP {resp.status_code}: {resp.text[:200]})."
    except Exception as e:
        return f"WARNING: Could not reach dashboard service ({type(e).__name__}: {e})."


def fetch_shapes_from_service() -> list[dict]:
    import httpx
    resp = httpx.get(f"{SERVICE_URL}/shapes/info?include=admin_names", timeout=30.0)
    resp.raise_for_status()
    return resp.json()["shapes"]


def deregister_from_service(indicator_id: str, permanent: bool, country: str) -> None:
    import httpx
    try:
        httpx.post(f"{SERVICE_URL}/indicators/deregister",
                   json={"indicator_id": indicator_id, "permanent": permanent, "country": country}, timeout=30.0)
    except Exception:
        logger.warning("Failed to deregister %s from service", indicator_id, exc_info=True)
