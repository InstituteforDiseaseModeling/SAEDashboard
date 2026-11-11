"""Download GADM GeoJSON files for African countries and transform into app format."""
import argparse
import json
import re
import sys
import time
import unicodedata
import urllib.request
import urllib.error
from datetime import datetime, timezone
from pathlib import Path

GADM_BASE = "https://geodata.ucdavis.edu/gadm"
SCRIPT_DIR = Path(__file__).resolve().parent
GADM_DIR = SCRIPT_DIR.parent / "data" / "gadm"
LOOKUP_PATH = SCRIPT_DIR / "gadm_name_lookup.json"

_IGNORED_CHARS = {' ', '-', '_', "'"}

lookup_misses = {}  # raw_name -> camelcase_fixed_name


def normalize(s):
    return ''.join(
        c for c in unicodedata.normalize('NFD', str(s))
        if unicodedata.category(c) != 'Mn' and c not in _IGNORED_CHARS
    ).casefold()


def camelcase_split(s):
    return re.sub(r'(?<=[a-z])(?=[A-Z])', ' ', s)


def fix_name(raw, name_lookup):
    n = normalize(raw)
    found = name_lookup.get(n)
    if found:
        return found
    fixed = camelcase_split(raw)
    if fixed != raw:
        lookup_misses[raw] = fixed
        return fixed
    lookup_misses[raw] = raw
    return raw


def load_lookup():
    data = json.loads(LOOKUP_PATH.read_text())
    return data["countries"], data["names"]


def resolve_latest_version():
    url = f"{GADM_BASE}/"
    try:
        with urllib.request.urlopen(url, timeout=30) as resp:
            html = resp.read().decode()
    except Exception as e:
        raise RuntimeError(f"Cannot reach {url} to discover latest version: {e}")
    versions = re.findall(r'href="gadm(\d+\.\d+)/"', html)
    if not versions:
        raise RuntimeError(f"No GADM versions found at {url}")
    return max(versions, key=lambda v: tuple(int(x) for x in v.split(".")))


def gadm_url(version, iso3, level):
    compact = version.replace(".", "")
    return f"{GADM_BASE}/gadm{version}/json/gadm{compact}_{iso3}_{level}.json"


def fetch_json(url):
    req = urllib.request.Request(url, headers={"User-Agent": "AIVA-dashboards/1.0"})
    with urllib.request.urlopen(req, timeout=60) as resp:
        return json.loads(resp.read().decode())


def transform_features(geojson, gadm_level, country_name, name_lookup):
    features = []
    for feat in geojson.get("features", []):
        props = feat.get("properties", {})
        if gadm_level == 1:
            name = fix_name(props.get("NAME_1", ""), name_lookup)
            dot_name = f"Africa:{country_name}:{name}"
        else:
            name1 = fix_name(props.get("NAME_1", ""), name_lookup)
            name = fix_name(props.get("NAME_2", ""), name_lookup)
            dot_name = f"Africa:{country_name}:{name1}:{name}"
        features.append({
            "type": "Feature",
            "id": dot_name,
            "properties": {
                "country": country_name.lower(),
                "TYPE": gadm_level,
                "id": dot_name,
                "name": name,
            },
            "geometry": feat.get("geometry"),
        })
    return features


def should_skip(version):
    prov_path = GADM_DIR / "provenance.json"
    if not prov_path.exists():
        return False
    try:
        prov = json.loads(prov_path.read_text())
    except (json.JSONDecodeError, OSError):
        return False
    if prov.get("gadm_version") != version:
        return False
    for fname in ("Africa_admin1.json", "Africa_admin2.json"):
        p = GADM_DIR / fname
        if not p.exists() or p.stat().st_size == 0:
            return False
    return True


def download_all(version, iso3_countries, name_lookup):
    GADM_DIR.mkdir(parents=True, exist_ok=True)
    results = {}
    for gadm_level in (1, 2):
        all_features = []
        countries_ok = []
        for iso3, country_name in iso3_countries.items():
            url = gadm_url(version, iso3, gadm_level)
            try:
                data = fetch_json(url)
                feats = transform_features(data, gadm_level, country_name, name_lookup)
                all_features.extend(feats)
                countries_ok.append(country_name)
                print(f"  {iso3} L{gadm_level}: {len(feats)} features")
            except urllib.error.HTTPError as e:
                if e.code == 404:
                    print(f"  {iso3} L{gadm_level}: not available (404), skipping")
                else:
                    print(f"  {iso3} L{gadm_level}: HTTP {e.code}, skipping")
            except Exception as e:
                print(f"  {iso3} L{gadm_level}: {e}, skipping")
            time.sleep(0.1)

        out_name = f"Africa_admin{gadm_level}.json"
        out_path = GADM_DIR / out_name
        output = {"Africa": {"type": "FeatureCollection", "features": all_features}}
        out_path.write_text(json.dumps(output))
        print(f"\n  Wrote {out_name} ({len(all_features)} features from {len(countries_ok)} countries)")
        results[str(gadm_level)] = {
            "file": out_name,
            "feature_count": len(all_features),
            "country_count": len(countries_ok),
        }

    prov = {
        "gadm_version": version,
        "downloaded_at": datetime.now(timezone.utc).isoformat(),
        "admin_levels": results,
        "countries": sorted(iso3_countries.values()),
    }
    prov_path = GADM_DIR / "provenance.json"
    prov_path.write_text(json.dumps(prov, indent=2))
    print(f"\n  Wrote provenance.json (GADM {version})")


def print_lookup_report():
    if not lookup_misses:
        print("\nAll names resolved via lookup table.")
        return

    auto_fixed = {k: v for k, v in lookup_misses.items() if v != k}
    unfixable = {k: v for k, v in lookup_misses.items() if v == k}

    print(f"\n{'='*60}")
    print(f"WARNING: {len(lookup_misses)} name(s) not found in lookup table")
    print(f"{'='*60}")

    if auto_fixed:
        print(f"\n  CamelCase fallback applied ({len(auto_fixed)}):")
        for raw, fixed in sorted(auto_fixed.items()):
            print(f"    {raw!r} -> {fixed!r}")

    if unfixable:
        print(f"\n  No fix available — used raw GADM name ({len(unfixable)}):")
        for raw in sorted(unfixable):
            print(f"    {raw!r}")

    print(f"\n  Update {LOOKUP_PATH.name} to fix these names.")
    print(f"{'='*60}")


def main():
    parser = argparse.ArgumentParser(description="Download GADM Africa GeoJSON")
    parser.add_argument("--version", default="latest",
                        help="GADM version to download (default: latest)")
    args = parser.parse_args()

    version = args.version
    if version == "latest":
        print("Resolving latest GADM version...")
        version = resolve_latest_version()
    print(f"GADM version: {version}")

    if should_skip(version):
        print(f"GADM {version} data already downloaded, skipping.")
        return

    iso3_countries, name_lookup = load_lookup()
    print(f"Loaded lookup: {len(iso3_countries)} countries, {len(name_lookup)} names")
    print(f"\nDownloading GADM {version} for {len(iso3_countries)} countries...\n")
    download_all(version, iso3_countries, name_lookup)
    print_lookup_report()

    if lookup_misses:
        print("\nDone (with warnings).")
        sys.exit(1)
    else:
        print("\nDone.")


if __name__ == "__main__":
    main()
