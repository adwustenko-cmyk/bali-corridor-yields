# Contributing

Thanks for considering a contribution. This dataset is editorial in nature — every yield range, every sub-zone classification, and every entry-price band reflects an editorial judgment grounded in source-tier methodology. We welcome corrections and additions, but we hold a high bar on evidence.

## How to contribute

### 1. Report a data error

If the data conflicts with what you observe in the field — opens an issue using the **"Data correction"** template.

You will need to provide:

- **Specific sub-zone affected** (e.g. `Canggu / Berawa`, `Bukit / Pecatu`)
- **Field affected** (e.g. `grossYieldRange`, `entryPriceRange`, `adrPeak`)
- **The current value** (paste from the JSON)
- **Your proposed correction** (single value or range)
- **Source backing the correction**, ideally Tier 1 / Tier 2:
  - AirDNA report covering the period
  - Recent transaction data (anonymised price-per-sqm at minimum)
  - Knight Frank or Global Property Guide reference
  - Operator-published occupancy data
- **Time period** the correction reflects (current quarter, year-rolling, etc.)

Issues without source backing will be marked `needs-evidence` and may be closed if no source is provided within 14 days.

### 2. Add a new sub-zone

The dataset will grow as Bali corridors mature. To propose a new sub-zone, open an issue using the **"New sub-zone"** template with:

- **Corridor parent** (e.g. `Canggu`, `Bukit`, new corridor)
- **Proposed name** (the canonical local-vernacular name)
- **Why this is editorially distinct** from neighbouring sub-zones already in the data
- **All eight required fields** (tier, grossYieldRange, netYieldRange, occupancyRange, adrPeak, adrShoulder, adrLow, entryPriceRange) plus notes
- **Sources** for each numeric range

We will not add sub-zones below ~50 transacting villas per year — the data thins out below that threshold and editorial confidence drops below acceptable.

### 3. Code or example contributions

Pull requests for [`examples/`](examples/) loaders, schema definitions, validation scripts, or data-transformation utilities are welcome. Match the existing style; small focused PRs over large ones.

For visual / mapping / dashboard contributions, please open an issue first to discuss scope.

### 4. Methodology improvements

If you spot a systemic methodology gap (a missing source tier, an unused dataset that should inform yield estimates, or a calculation rule that's wrong), open an issue tagged `methodology`. We respond to methodology issues within 7 business days.

## Pull request workflow

1. Fork the repo
2. Create a feature branch (`feature/add-uluwatu-bingin-update` or `fix/canggu-berawa-yield-correction`)
3. Make the change to `data/bali-corridor-yields.json`
4. Bump `_meta.version` (semver: patch for corrections, minor for new sub-zones, major for breaking schema changes)
5. Update `_meta.lastUpdated` to today's date in ISO format
6. Add an entry to [CHANGELOG.md](CHANGELOG.md)
7. Open the PR with description + sources + impact summary

The maintainer team reviews PRs within 5 business days.

## Style

- **No promotional language** in `notes` fields. Editorial-investigative tone only.
- **No partner-agency mentions** in any field — this dataset is brand-agnostic.
- **No em dashes** (`—`) in body text. Use en dashes (`–`).
- **Consistent currency** — all numeric values are USD unless documented otherwise in `_meta`.
- **Ranges always low-to-high** — `[7, 9]` not `[9, 7]`.

## What we don't accept

- Unverified single-source corrections without supporting evidence
- Promotional or developer-supplied numbers (developer-projected yields are typically inflated 30–60%)
- Historical data older than 12 months
- Speculation on future appreciation (this dataset is yields-only)
- New corridors entirely outside Bali (Phuket, Lombok, Java sub-zones may get separate datasets in future)

## Recognition

Contributors are credited in the next refresh of [CHANGELOG.md](CHANGELOG.md) by GitHub handle. If you want a more prominent credit (e.g. in the dataset's `_meta.contributors` field), open an issue.

## Code of conduct

Be specific. Be sourced. Be honest about uncertainty. Editorial work is the discipline of saying what you know, marking what you don't, and citing where the line is.
