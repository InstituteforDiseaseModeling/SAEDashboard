import re
from pathlib import Path
import pandas as pd

DOT_NAME_PATTERN = re.compile(
    r'^[A-Za-z]+(?::[A-Za-z\s\-\u00C0-\u024F]+)+$'
)

REQUIRED_COLUMNS = ['state', 'year', 'pred', 'pred_upper', 'pred_lower']


def validate_indicator_csv(path: Path) -> list[str]:
    issues = []
    try:
        df = pd.read_csv(path)
    except Exception as e:
        return [f"Cannot read CSV: {e}"]

    if len(df) == 0:
        issues.append("File has no data rows")
        return issues

    for col in REQUIRED_COLUMNS:
        if col not in df.columns:
            issues.append(f"Missing required column: {col}")

    if 'state' in df.columns:
        bad = [
            s for s in df['state'].dropna().head(20)
            if not DOT_NAME_PATTERN.match(str(s))
        ]
        if bad:
            issues.append(f"Invalid dot_name format in 'state': {bad[:3]}")

    for col in ['pred', 'pred_upper', 'pred_lower']:
        if col in df.columns and not pd.api.types.is_numeric_dtype(df[col]):
            issues.append(f"Column '{col}' must be numeric")

    if all(c in df.columns for c in ['pred', 'pred_lower', 'pred_upper']):
        valid = df[['pred', 'pred_lower', 'pred_upper']].dropna()
        if len(valid) > 0:
            violations = (
                (valid['pred_lower'] > valid['pred']).sum()
                + (valid['pred'] > valid['pred_upper']).sum()
            )
            if violations > 0:
                issues.append(f"{violations} rows where pred_lower > pred or pred > pred_upper")

    return issues
