import logging
import os
import re
from pathlib import Path
from typing import Optional

import pandas as pd

from mind_core import MindConfig, FileSessionStore, Session, make_tool_dispatch, EXECUTE_PYTHON_SCHEMA
from mind_core.onboarding import (
    OnboardingConfig, make_onboarding_dispatch, get_onboarding_schemas,
    make_onboarding_post_tool_hook, make_onboarding_request_hook,
    onboarding_progress_message, get_cached_index,
    build_onboarding_prompt,
)
from mind_core.onboarding.metadata_store import list_indicators

from hooks import register_with_service, deregister_from_service, fetch_shapes_from_service

logger = logging.getLogger(__name__)

MODEL = os.getenv("LLM_MODEL", "claude-sonnet-5-5")
LLM_API_BASE = os.getenv("LLM_API_BASE")
LLM_API_KEY = os.getenv("LLM_API_KEY")
LLM_SYSTEM_SUFFIX = os.getenv("LLM_SYSTEM_SUFFIX", "")
MAX_TOKENS = int(os.getenv("LLM_MAX_TOKENS", "8192"))
DATA_DIR = os.getenv("DATA_DIR", "/data")
MANUAL_INDICATORS_DIR = os.getenv("MANUAL_INDICATORS_DIR", "/app/manually-added-indicators")

_FILE_PATTERN = re.compile(
    r'^(?P<country>.+?)__(?P<indicator>.+?)__(?P<subgroup>.+?)__(?P<version>.+)\.csv$'
)
_manual_index_cache: Optional[str] = None
_manual_index_mtime: float = 0.0


def _dir_max_mtime(d: Path) -> float:
    try:
        return max((f.stat().st_mtime for f in d.glob("*.csv")), default=0.0)
    except OSError:
        return 0.0


def _build_manual_indicator_index(indicators_dir: Path) -> str:
    if not indicators_dir.is_dir():
        return "(no manually-added indicators available)"
    csv_files = sorted(indicators_dir.glob("*.csv"))
    if not csv_files:
        return "(no manually-added indicators available)"

    grouped: dict[str, list[dict]] = {}
    for f in csv_files:
        m = _FILE_PATTERN.match(f.name)
        if not m:
            continue
        grouped.setdefault(m.group("indicator"), []).append({
            "file": f, "country": m.group("country"),
            "subgroup": m.group("subgroup"), "version": m.group("version"),
        })
    if not grouped:
        return "(no manually-added indicators available)"

    entries = []
    for name, files in sorted(grouped.items()):
        display = name.replace("_", " ").title()
        subgroups = [f["subgroup"] for f in files]
        filenames = [f["file"].name for f in files]
        parts = [f"- **{name}** ({display}): country={files[0]['country']}, subgroups={subgroups}"]
        try:
            df_sample = pd.read_csv(files[0]["file"], nrows=5)
            cols = list(df_sample.columns)
            parts.append(f"  columns={cols}")
            if "year" in df_sample.columns:
                df_meta = pd.read_csv(files[0]["file"], usecols=["year", "state"])
                parts.append(f"  years={int(df_meta['year'].min())}-{int(df_meta['year'].max())}, regions={df_meta['state'].nunique()}")
        except Exception as e:
            logger.debug("manual index scan %s: %s", files[0]["file"].name, e)
        parts.append(f"  files={filenames}")
        entries.append("\n".join(parts))
    return "\n".join(entries)


def get_manual_indicator_index(indicators_dir: Path) -> str:
    global _manual_index_cache, _manual_index_mtime
    current_mtime = _dir_max_mtime(indicators_dir)
    if _manual_index_cache is not None and current_mtime == _manual_index_mtime:
        return _manual_index_cache
    _manual_index_cache = _build_manual_indicator_index(indicators_dir)
    _manual_index_mtime = current_mtime
    return _manual_index_cache


ob_config = OnboardingConfig(
    data_dir=DATA_DIR,
    register_indicator=register_with_service,
    deregister_indicator=deregister_from_service,
    fetch_shape_info=fetch_shapes_from_service,
    display_config_spec="""\
Per-indicator display settings for the dashboard:
- unit: suffix after formatted numbers (e.g. "%")
- multiplier: scalar applied before display (e.g. 100 for %)
- chart_type: "bar" or "stackBar" (line chart when unset)
- decimal_pt: decimal places for display
- unit_label: metric/unit message id
- map_label: map popup tooltip label
- legend_label: map legend title
- use_avg: aggregate by average instead of sum
- y_axis_label: bar/stacked chart y-axis label""",
)


def _onboarding_prompt(session: Session) -> list[dict]:
    return build_onboarding_prompt(session, ob_config)


def _analytical_prompt(session: Session) -> list[dict]:
    from workflow.prompts.analytical import _STATIC_BLOCK
    sid = session.session_id
    user_inventory = get_cached_index(ob_config.metadata_path, ob_config.indicators_dir)
    manual_inventory = get_manual_indicator_index(Path(MANUAL_INDICATORS_DIR))
    dynamic = f"""\
## Session Context
- Session ID: {sid}
- User indicators directory: {DATA_DIR}/indicators/
- Manually-added indicators directory: {MANUAL_INDICATORS_DIR}/
- Temp directory: {DATA_DIR}/tmp/{sid}/

## User-Created Indicators
{user_inventory}

## Manually-Added Indicators
{manual_inventory}

Both indicator inventories list all available data. Use execute_python directly — no lookup tools needed.
When looking for an indicator, check BOTH sections.
User indicators: {DATA_DIR}/indicators/  |  Manually-added: {MANUAL_INDICATORS_DIR}/
"""
    return [
        {"type": "text", "text": _STATIC_BLOCK, "cache_control": {"type": "ephemeral"}},
        {"type": "text", "text": dynamic},
    ]


def _system_prompt(session: Session):
    if session.mode == "onboarding":
        return _onboarding_prompt(session)
    return _analytical_prompt(session)


def _tool_schemas(session: Session):
    if session.mode == "onboarding":
        return get_onboarding_schemas(include_python=True)
    return [EXECUTE_PYTHON_SCHEMA]


_onboarding_dispatch = make_onboarding_dispatch(ob_config)
_analytical_dispatch = make_tool_dispatch(cwd=str(Path(DATA_DIR) / "indicators"), data_dir=DATA_DIR)


def _tool_dispatch(session: Session):
    if session.mode == "onboarding":
        return {**_analytical_dispatch, **_onboarding_dispatch}
    return _analytical_dispatch


def _title_generator(message: str, session: Session) -> str:
    text = message.strip()[:200]
    indicator_names = {m.display_name.lower(): m.display_name for m in list_indicators(ob_config.metadata_path)}
    prefix = ""
    text_lower = text.lower()
    for name_lower, name in sorted(indicator_names.items(), key=lambda x: -len(x[0])):
        if name_lower in text_lower:
            prefix = name + ": "
            text = re.sub(re.escape(name_lower), '', text_lower, count=1).strip()
            break
    words = text.split()
    filler = {"the", "a", "an", "is", "are", "of", "for", "in", "on", "to", "and", "or",
              "can", "you", "me", "my", "this", "that", "it", "what", "how", "do", "does",
              "please", "i", "about", "with"}
    key_words = [w.strip("?,.'\"!") for w in words if w.lower().strip("?,.'\"!") not in filler]
    snippet = " ".join(key_words[:5]) if key_words else " ".join(words[:5])
    title = prefix + snippet
    return title[:60] if title else "New conversation"


def build_config() -> tuple[MindConfig, OnboardingConfig]:
    store = FileSessionStore(Path(DATA_DIR) / "sessions", data_dir=DATA_DIR)
    store.rehydrate()

    config = MindConfig(
        model=MODEL,
        max_tokens=MAX_TOKENS,
        api_key=LLM_API_KEY,
        api_base=LLM_API_BASE,
        system_prompt=_system_prompt,
        system_prompt_suffix=LLM_SYSTEM_SUFFIX,
        tool_schemas=_tool_schemas,
        tool_dispatch=_tool_dispatch,
        post_tool_hook=make_onboarding_post_tool_hook(ob_config),
        request_hook=make_onboarding_request_hook(ob_config),
        progress_message=onboarding_progress_message,
        title_generator=_title_generator,
        session_store=store,
        default_session_mode="analytical",
        data_dir=DATA_DIR,
    )
    return config, ob_config
