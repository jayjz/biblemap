"""Pure epoch contract shared by SQL export, chunk generation and validation.

The manifest preserves the application's existing Ussher partitions; it is not
an independent historical source. No database or Arrow import is needed here.
"""
import json
import math
from pathlib import Path

MANIFEST_PATH = Path(__file__).resolve().parents[1] / 'src/domain/epochs.json'
MANIFEST = json.loads(MANIFEST_PATH.read_text())
EPOCHS = MANIFEST['epochs']


def epoch_for_year(year):
    if isinstance(year, bool) or not isinstance(year, (int, float)) or not math.isfinite(year):
        raise ValueError('Year must be finite')
    return next(epoch['id'] for epoch in EPOCHS
                if epoch['endYearInclusive'] is None or year <= epoch['endYearInclusive'])


def epoch_case_sql():
    """SQL for the export's fixed, trusted year column; IDs come from the manifest."""
    clauses = [f"WHEN e.ussher_year <= {epoch['endYearInclusive']} THEN {epoch['id']}"
               for epoch in EPOCHS if epoch['endYearInclusive'] is not None]
    return 'CASE ' + ' '.join(clauses) + f" ELSE {EPOCHS[-1]['id']} END"
