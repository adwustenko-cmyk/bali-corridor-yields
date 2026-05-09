"""
Example loader for the Bali corridor yields dataset (Python 3.7+).

Demonstrates:
  - Fetching the dataset directly from GitHub
  - Loading from local file
  - Computing corridor-level summaries (mean / range)
  - Comparing two sub-zones
  - Underwriting a new villa against corridor baselines

Requires only the standard library (urllib + json). No external deps.
"""

from __future__ import annotations

import json
import statistics
from pathlib import Path
from typing import Any
from urllib.request import urlopen

GITHUB_URL = (
    "https://raw.githubusercontent.com/bali-villa-select/"
    "bali-corridor-yields/main/data/bali-corridor-yields.json"
)


def load_remote() -> dict[str, Any]:
    """Fetch the latest dataset from GitHub."""
    with urlopen(GITHUB_URL) as resp:
        return json.loads(resp.read())


def load_local(path: str | Path = "data/bali-corridor-yields.json") -> dict[str, Any]:
    """Load a previously-downloaded copy from disk."""
    return json.loads(Path(path).read_text(encoding="utf-8"))


def corridor_summary(data: dict, corridor: str) -> dict:
    """Average gross yield and ADR across all sub-zones of a corridor."""
    if corridor not in data:
        raise KeyError(f"Corridor not found: {corridor!r}")
    sub_zones = {k: v for k, v in data[corridor].items() if isinstance(v, dict)}
    gross_lows = [s["grossYieldRange"][0] for s in sub_zones.values()]
    gross_highs = [s["grossYieldRange"][1] for s in sub_zones.values()]
    peak_lows = [s["adrPeak"][0] for s in sub_zones.values()]
    peak_highs = [s["adrPeak"][1] for s in sub_zones.values()]

    return {
        "corridor": corridor,
        "subZones": list(sub_zones.keys()),
        "grossYieldMedianLow": statistics.median(gross_lows),
        "grossYieldMedianHigh": statistics.median(gross_highs),
        "adrPeakMedianLow": statistics.median(peak_lows),
        "adrPeakMedianHigh": statistics.median(peak_highs),
    }


def compare_sub_zones(
    data: dict, corridor_a: str, sub_a: str, corridor_b: str, sub_b: str
) -> dict:
    """Side-by-side comparison of two sub-zones for an investor decision."""
    a = data[corridor_a][sub_a]
    b = data[corridor_b][sub_b]
    return {
        f"{corridor_a}/{sub_a}": {
            "tier": a["tier"],
            "gross": a["grossYieldRange"],
            "net": a["netYieldRange"],
            "occupancy": a["occupancyRange"],
            "entryPrice": a["entryPriceRange"],
        },
        f"{corridor_b}/{sub_b}": {
            "tier": b["tier"],
            "gross": b["grossYieldRange"],
            "net": b["netYieldRange"],
            "occupancy": b["occupancyRange"],
            "entryPrice": b["entryPriceRange"],
        },
    }


def underwrite_villa(
    data: dict,
    corridor: str,
    sub_zone: str,
    purchase_price_usd: float,
    apply_year_one_haircut: bool = True,
) -> dict:
    """
    Quick underwrite: estimate annual revenue and net yield for a villa
    in a given sub-zone, using corridor baselines.

    Year-1 typically delivers 60-75% of stabilised numbers; the haircut
    applies the 70% midpoint by default.
    """
    zone = data[corridor][sub_zone]
    occ_mid = sum(zone["occupancyRange"]) / 2 / 100  # to fraction
    adr_mid = sum(zone["adrPeak"] + zone["adrShoulder"] + zone["adrLow"]) / 6  # rough year-blended mid

    revenue_stabilised = adr_mid * occ_mid * 365
    revenue = revenue_stabilised * (0.70 if apply_year_one_haircut else 1.0)

    gross_yield = revenue / purchase_price_usd * 100
    net_yield_low = gross_yield * 0.65  # 35% gross-to-net cost gap (high-bound)
    net_yield_high = gross_yield * 0.75  # 25% cost gap (low-bound)

    return {
        "corridor": corridor,
        "subZone": sub_zone,
        "purchasePriceUSD": purchase_price_usd,
        "blendedADRMid": round(adr_mid, 2),
        "occupancyMid": round(occ_mid * 100, 1),
        "estimatedRevenueUSD": round(revenue),
        "estimatedGrossYieldPct": round(gross_yield, 2),
        "estimatedNetYieldRangePct": [round(net_yield_low, 2), round(net_yield_high, 2)],
        "yearOneHaircutApplied": apply_year_one_haircut,
        "subZoneNotes": zone["notes"],
    }


# ─── Demo ──────────────────────────────────────────────────────────────

if __name__ == "__main__":
    # Choose loader based on whether you have local or want fresh.
    # data = load_local()
    data = load_remote()

    print(f"Dataset version: {data['_meta']['version']} "
          f"(last updated {data['_meta']['lastUpdated']})\n")

    # Corridor summary
    canggu = corridor_summary(data, "Canggu")
    print(f"Canggu summary: gross yield median {canggu['grossYieldMedianLow']}-"
          f"{canggu['grossYieldMedianHigh']}%, peak ADR median "
          f"${canggu['adrPeakMedianLow']:.0f}-${canggu['adrPeakMedianHigh']:.0f}/night\n")

    # Compare two sub-zones
    cmp = compare_sub_zones(data, "Canggu", "Berawa", "Bukit", "Bingin / Padang Padang")
    print("Side-by-side comparison:")
    print(json.dumps(cmp, indent=2))
    print()

    # Underwrite a hypothetical villa
    uw = underwrite_villa(data, "Canggu", "Berawa", purchase_price_usd=500_000)
    print(f"Underwrite — Berawa villa @ $500k, year 1:")
    print(f"  Estimated revenue:  ${uw['estimatedRevenueUSD']:,}/year")
    print(f"  Gross yield:        {uw['estimatedGrossYieldPct']}%")
    print(f"  Net yield range:    {uw['estimatedNetYieldRangePct'][0]}-"
          f"{uw['estimatedNetYieldRangePct'][1]}%")
    print(f"  Note: {uw['subZoneNotes']}")
    print()

    # Citation reminder
    print(f"Citation: {data['_meta']['citationText']}")
