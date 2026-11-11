"""Convert Africa GeoJSON files into per-country pickle files for the shapes API."""
import json
import pickle
import shutil
from collections import defaultdict
from pathlib import Path

GADM_DIR = Path(__file__).resolve().parents[1] / "data" / "gadm"
SHAPE_DIR = Path(__file__).resolve().parents[1] / "data" / "shapefiles"


def title_case_country(raw: str) -> str:
    return raw.replace("_", " ").title().replace(" ", "_") if "_" in raw else raw.title()


def build_pickles(geojson_path: Path, admin_level: int, version: int = 1):
    with open(geojson_path) as f:
        data = json.load(f)

    fc = data.get("Africa", data)
    if isinstance(fc, dict) and "features" in fc:
        features = fc["features"]
    else:
        raise ValueError(f"Unexpected structure in {geojson_path}")

    by_country: dict[str, dict] = defaultdict(dict)
    for feat in features:
        props = feat.get("properties", {})
        dot_name = props.get("id", "")
        country_raw = props.get("country", "")
        if not dot_name or not country_raw:
            continue
        country_key = title_case_country(country_raw)
        by_country[country_key][dot_name] = feat

    SHAPE_DIR.mkdir(parents=True, exist_ok=True)

    # Also build the full Africa pickle
    all_features = {}
    for country_key, features_dict in by_country.items():
        filename = f"{country_key}__l{admin_level}__{version}.shp.pickle"
        out_path = SHAPE_DIR / filename
        with open(out_path, "wb") as f:
            pickle.dump(features_dict, f)
        all_features.update(features_dict)
        print(f"  {filename} ({len(features_dict)} features)")

    africa_path = SHAPE_DIR / f"Africa__l{admin_level}__{version}.shp.pickle"
    with open(africa_path, "wb") as f:
        pickle.dump(all_features, f)
    print(f"  Africa__l{admin_level}__{version}.shp.pickle ({len(all_features)} features)")


if __name__ == "__main__":
    for adm_level, filename in [(1, "Africa_admin1.json"), (2, "Africa_admin2.json")]:
        src = GADM_DIR / filename
        if src.exists():
            print(f"\nProcessing {filename} (admin_level={adm_level}):")
            build_pickles(src, adm_level)
        else:
            print(f"Skipping {filename} (not found)")

    prov_src = GADM_DIR / "provenance.json"
    if prov_src.exists():
        shutil.copy2(prov_src, SHAPE_DIR / "provenance.json")
        print("\nCopied provenance.json to shapefiles/")
    print("\nDone.")
