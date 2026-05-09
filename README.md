# Bali Corridor Yield Baselines

Open dataset of stabilised year-2 rental yield ranges for Bali property corridors. Maintained by the [Bali Villa Select](https://balivillaselect.com) editorial desk and refreshed quarterly.

[![License: CC BY 4.0](https://img.shields.io/badge/License-CC_BY_4.0-lightgrey.svg)](https://creativecommons.org/licenses/by/4.0/)
[![Last updated](https://img.shields.io/badge/last_updated-2026--05-blue.svg)](#changelog)
[![Version](https://img.shields.io/badge/version-1.0.0-green.svg)](#changelog)

---

## What this is

A structured JSON dataset covering the editorial-grade rental yield baselines for **26 sub-zones across 7 corridors**:

**Bali (primary coverage — high data confidence):**
- **Canggu** — Berawa, Pererenan, Echo Beach / Batu Bolong, Babakan, Canggu Beach
- **Bukit** — Uluwatu Clifftop, Bingin / Padang Padang, Pecatu, Dreamland Beach, Jimbaran, Nusa Dua
- **Seminyak** — Petitenget Premium, Seminyak Central, Kerobokan / Berawa Border
- **Ubud** — Ubud Central, Tegallalang / Rice Paddy
- **Sanur** — Sanur Beach

**Phuket (secondary coverage — medium data confidence):**
- **Phuket** — Bang Tao / Laguna, Surin / Cherngtalay, Patong, Karon / Kata, Nai Harn / Rawai, Layan / Kamala

**Lombok (tertiary coverage — low data confidence, directional only):**
- **Lombok** — Selong Belanak / Kuta Lombok, Senggigi, Gili Trawangan / Air / Meno

For each sub-zone:

| Field | What it means |
|---|---|
| `tier` | Editorial classification (premium / mid-tier / emerging / scarcity premium / etc.) |
| `grossYieldRange` | Stabilised year-2 gross yield, % of purchase price (reflects 2BR median product) |
| `netYieldRange` | Net yield after the 25-35% gross-to-net cost gap |
| `occupancyRange` | Year-blended occupancy %, well-managed properties |
| `adrPeak` / `adrShoulder` / `adrLow` | Average daily rate by season, USD |
| `entryPriceRange` | Typical entry price for the predominant product, USD |
| `predominantBedroomMix` | What configurations actually trade in this sub-zone — informs which bedroom-yield-adjustment to apply |
| `notes` | Editorial commentary on what drives yield + key trade-offs |

Year-1 typically delivers 60–75% of stabilised values during the review-build period. Underwrite at the lower bound for new villas.

### Four additional metadata blocks

**`_meta.bedroomYieldAdjustments`** — sub-zone numbers reflect 2BR median. For 1BR / 3BR / 4BR+ products, apply the systemic deltas (e.g. 1BR is typically -2 to -3pp gross yield versus 2BR baseline because ADR caps lower while operating drag stays similar).

**`_meta.phuketSeasonality`** — Phuket peak is Dec-Mar (inverted from Bali's Jul-Aug + Dec-Jan double-peak). Plan operator and pricing accordingly.

**`_meta.currencyOverlay`** — All values are USD-denominated. For IDR or THB-domiciled investors, use this block to translate yields and acquisition costs at consistent FX. Includes 2025 annual averages for IDR (16,200) and THB (35.5), trend commentary, and hedging notes for foreign-buyer exposure.

**`_meta.operatorQualityMultipliers`** — The single largest yield-influencing variable within a sub-zone is operator quality. Top-quartile operators deliver 1.15–1.30x median yield; bottom-quartile 0.65–0.80x. Block includes characteristics of each tier, typical revenue premiums, and four operator due-diligence questions to ask before signing a management contract.

### Quarterly + annual retrospective

[`data/quarterly-retrospective.json`](data/quarterly-retrospective.json) tracks shifts in yield, ADR, and occupancy for the major Bali sub-zones, with editorial narrative and key findings.

Includes:

- **Annual snapshot 2025** — full-year mids for 9 sub-zones, with `yoyDelta` vs 2024 and per-villa annual revenue figures
- **Q4 2025 + Q1 2026 quarterly snapshots** — quarterly mids with `delta_vs_prior` blocks
- **5 key findings** — corridor softening, Pererenan-arbitrage thesis, Bingin 1BR saturation, Nusa Dua stability, Ubud resilience — each with severity and underwrite implication

Use for trend analysis and to calibrate underwrite assumptions against current cycle position.

## Why we publish this

Most Bali property publications quote either developer-projected yields (frequently inflated) or single-point estimates without methodology. This dataset is the corridor baseline that the Bali Villa Select editorial desk uses to evaluate every listing on our [marketplace](https://balivillaselect.com/marketplace) and every analysis in our [investor dossiers](https://balivillaselect.com/tools/villa-analyzer).

We open-source it for three reasons:

1. **Transparency.** Anyone using our analysis should be able to verify the underlying numbers.
2. **Independent reuse.** Researchers, journalists, prop-tech developers and individual investors can use the data without paywalls or scraping.
3. **Network correction.** When numbers are wrong, the fastest correction comes from open data plus open contributors. PRs welcome.

## Quick start

### Direct fetch

```bash
curl https://raw.githubusercontent.com/bali-villa-select/bali-corridor-yields/main/data/bali-corridor-yields.json
```

### Python

```python
import json, urllib.request

URL = "https://raw.githubusercontent.com/bali-villa-select/bali-corridor-yields/main/data/bali-corridor-yields.json"
data = json.loads(urllib.request.urlopen(URL).read())

# Get gross yield range for Berawa
berawa = data["Canggu"]["Berawa"]
print(f"Berawa gross yield: {berawa['grossYieldRange'][0]}-{berawa['grossYieldRange'][1]}%")
# → Berawa gross yield: 11-14%
```

See [`examples/load-python.py`](examples/load-python.py) for a complete loader with corridor-comparison helpers.

### Node.js

```javascript
const data = await fetch(
  'https://raw.githubusercontent.com/bali-villa-select/bali-corridor-yields/main/data/bali-corridor-yields.json'
).then(r => r.json())

const berawa = data.Canggu.Berawa
console.log(`Berawa: ${berawa.grossYieldRange[0]}-${berawa.grossYieldRange[1]}% gross`)
```

See [`examples/load-node.mjs`](examples/load-node.mjs) for the complete example.

## Methodology

Source-tier discipline (see `_meta.sourceTiers` in the JSON):

- **Tier 1 (primary official)** — Statistics Indonesia (BPS), Bank of Indonesia, BKPM, ATR/BPN, ITDC
- **Tier 2 (institutional industry)** — AirDNA, Knight Frank Asia Pacific, Global Property Guide, Bali Tourism Board
- **Tier 3 (observed market)** — Direct observation of partner-agency transaction patterns, cross-checked against Tier 1/2

Range methodology: each `grossYieldRange` represents the **median range** for well-managed villas in the sub-zone. Top-quartile operators run 1–3 percentage points above the upper bound. Bottom-quartile under-perform by 2–4 points below the lower bound.

Full methodology with citation rules: <https://balivillaselect.com/methodology>

### What this data does NOT cover

- **One-off luxury or distressed sales** — we report median ranges, not outliers
- **Pre-stabilisation Year 1 numbers** — typically 60–75% of the values shown
- **Newly-emerging sub-zones not in this list** — submit via the [new-subzone issue template](.github/ISSUE_TEMPLATE/new-subzone.md)
- **Long-term lease rather than short-term rental** — long-term yields run 5–7%, see notes
- **Price appreciation projections** — yields only
- **Phuket transaction-level data** — Phuket coverage is secondary, derived from institutional research (Knight Frank, Global Property Guide) plus AirDNA Phuket overview, NOT direct transaction observation as for Bali. Apply with extra caution.

## Refresh schedule

Quarterly. The `_meta.lastUpdated` field is the source of truth.

If you need confirmation that data is current, check the [CHANGELOG](CHANGELOG.md).

## Citation

If you use this data, attribution is required (per CC BY 4.0):

```
Data source: Bali Villa Select corridor baselines (https://github.com/bali-villa-select/bali-corridor-yields), CC BY 4.0.
```

For academic, journalistic, or commercial use, please link to <https://balivillaselect.com> in addition to the GitHub repo. We track citations and prioritise data refresh on requests from active users.

## Contributing

Yield estimates are inherently directional. If your data conflicts with ours, **please open an issue** with your evidence:

- Tier 1 / Tier 2 source preferred
- Specific sub-zone affected
- Time period covered
- Transaction or AirDNA data backing the correction

See [CONTRIBUTING.md](CONTRIBUTING.md) for the issue / PR workflow.

## Licence

[CC BY 4.0](LICENSE) — free to use, modify, and redistribute with attribution.

The data is provided as-is for editorial and research use. **It is not investment, legal, or tax advice.** Foreign-buyer property purchases in Indonesia carry legal, regulatory, currency, and operational risks that this dataset does not enumerate. Conduct independent due diligence with a licensed PPAT-notary and a qualified Indonesian tax adviser before any LOI or deposit.

## Related projects

- [`balivillaselect.com`](https://balivillaselect.com) — the editorial site this dataset feeds
- [`bali-villa-select/villa-analyzer`](https://balivillaselect.com/tools/villa-analyzer) — the free 24-hour PDF dossier tool that uses this data

## Maintainers

Bali Villa Select editorial desk
- Site: <https://balivillaselect.com>
- Editorial team: <https://balivillaselect.com/editorial-team>
- Methodology: <https://balivillaselect.com/methodology>
- Contact: editorial@balivillaselect.com

## Star history

If this data is useful, ★ the repo — we use star count as a signal for prioritising refresh frequency on the most-used sub-zones.
