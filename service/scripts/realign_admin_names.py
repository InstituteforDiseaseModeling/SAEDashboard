"""Realign indicator CSV dot_names with current GADM shape names.

Run after upgrading GADM shapes to detect and fix name mismatches in indicator CSVs.

Usage:
    python realign_admin_names.py                  # dry-run report
    python realign_admin_names.py --apply           # rewrite CSVs (backs up as .bak)
    python realign_admin_names.py --threshold 0.7   # lower auto-apply threshold
"""
import argparse
import csv
import pickle
import re
import shutil
import unicodedata
from difflib import SequenceMatcher
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
DATA_DIR = SCRIPT_DIR.parent / "data" / "data"
SHAPE_DIR = SCRIPT_DIR.parent / "data" / "shapefiles"
SHAPE_RE = re.compile(r'^(?P<country>.+)__l(?P<level>\d+)__(?P<version>\d+)\.shp\.pickle$')

_IGNORED_CHARS = {' ', '-', '_'}


def normalize_dot_name(s):
    return ''.join(
        c for c in unicodedata.normalize('NFD', str(s))
        if unicodedata.category(c) != 'Mn' and c not in _IGNORED_CHARS
    ).casefold()


def load_shape_dot_names():
    names = set()
    norm_to_original = {}
    for p in SHAPE_DIR.glob("*.shp.pickle"):
        m = SHAPE_RE.match(p.name)
        if not m or m.group("country") == "Africa":
            continue
        with open(p, "rb") as f:
            shape_dict = pickle.load(f)
        for dn in shape_dict:
            names.add(dn)
            norm_to_original[normalize_dot_name(dn)] = dn
    return names, norm_to_original


def find_best_match(dn, norm_to_original, threshold):
    parts = dn.split(":")
    if len(parts) < 3:
        return None, 0.0
    country_norm = normalize_dot_name(parts[1])
    dn_norm = normalize_dot_name(dn)
    best, best_score = None, 0.0
    for norm_key, original in norm_to_original.items():
        orig_parts = original.split(":")
        if len(orig_parts) < 3:
            continue
        if normalize_dot_name(orig_parts[1]) != country_norm:
            continue
        score = SequenceMatcher(None, dn_norm, norm_key).ratio()
        if score > best_score:
            best, best_score = original, score
    return best, best_score


def process_csv(csv_path, shape_names, norm_to_original, threshold, apply):
    with open(csv_path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        if "state" not in (reader.fieldnames or []):
            return None
        rows = list(reader)

    unique_states = {r["state"] for r in rows}
    matched, renames, unmatched = 0, {}, []

    for state in sorted(unique_states):
        if state in shape_names:
            matched += 1
            continue
        norm = normalize_dot_name(state)
        if norm in norm_to_original:
            renames[state] = norm_to_original[norm]
            matched += 1
            continue
        best, score = find_best_match(state, norm_to_original, threshold)
        if best and score >= threshold:
            renames[state] = best
        elif best:
            unmatched.append((state, best, score))
        else:
            unmatched.append((state, None, 0.0))

    total = len(unique_states)
    report = [f"{csv_path.name}:"]
    report.append(f"  OK: {matched}/{total} dot_names matched")
    for old, new in sorted(renames.items()):
        tag = "AUTO" if apply else "WOULD RENAME"
        report.append(f"  RENAME: {old} → {new} [{tag}]")
    for old, suggestion, score in unmatched:
        if suggestion:
            report.append(f"  UNMATCHED: {old} → {suggestion} ({score:.2f}) [MANUAL]")
        else:
            report.append(f"  UNMATCHED: {old} → no match found [MANUAL]")

    if apply and renames:
        shutil.copy2(csv_path, csv_path.with_suffix(".bak"))
        for row in rows:
            if row["state"] in renames:
                row["state"] = renames[row["state"]]
        with open(csv_path, "w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=reader.fieldnames)
            writer.writeheader()
            writer.writerows(rows)
        report.append(f"  → Rewrote {csv_path.name} ({len(renames)} renames, backup: .bak)")

    return "\n".join(report)


def main():
    parser = argparse.ArgumentParser(description="Realign indicator CSV dot_names with GADM shapes")
    parser.add_argument("--apply", action="store_true", help="Rewrite CSVs (default: dry-run)")
    parser.add_argument("--threshold", type=float, default=0.8,
                        help="Min similarity for auto-rename (default: 0.8)")
    args = parser.parse_args()

    if not SHAPE_DIR.exists() or not list(SHAPE_DIR.glob("*.shp.pickle")):
        print(f"No shape pickles found in {SHAPE_DIR}. Run build_shape_pickles.py first.")
        return

    shape_names, norm_to_original = load_shape_dot_names()
    print(f"Loaded {len(shape_names)} shape dot_names\n")

    csv_files = sorted(DATA_DIR.glob("*.csv")) if DATA_DIR.exists() else []
    if not csv_files:
        print(f"No CSV files found in {DATA_DIR}")
        return

    mode = "APPLY" if args.apply else "DRY-RUN"
    print(f"Mode: {mode} (threshold: {args.threshold})\n")

    for csv_path in csv_files:
        report = process_csv(csv_path, shape_names, norm_to_original, args.threshold, args.apply)
        if report:
            print(report)
            print()


if __name__ == "__main__":
    main()
