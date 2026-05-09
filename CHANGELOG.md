# Changelog

All notable changes to this dataset are documented here. Refresh schedule is quarterly.

Versioning follows [SemVer](https://semver.org/):

- **MAJOR** — breaking schema change (renamed fields, removed corridors, etc.)
- **MINOR** — new sub-zone added, new metadata field
- **PATCH** — yield range correction, ADR refresh, notes update

## [1.0.0] — 2026-05-09

### Initial public release

- **26 sub-zones across 7 corridors:**
  - **Bali (primary, high confidence):** 17 sub-zones across Canggu, Bukit, Seminyak, Ubud, Sanur
  - **Phuket (secondary, medium confidence):** 6 sub-zones — Bang Tao / Laguna, Surin / Cherngtalay, Patong, Karon / Kata, Nai Harn / Rawai, Layan / Kamala
  - **Lombok (tertiary, low confidence — directional only):** 3 sub-zones — Selong Belanak / Kuta Lombok, Senggigi, Gili Trawangan / Air / Meno
- Full `_meta` block with methodology, source tiers, citation guidelines
- **`_meta.bedroomYieldAdjustments`** — systemic 1BR / 2BR / 3BR / 4BR+ yield-delta block. Sub-zone numbers reflect 2BR median; deltas let you map to other configurations.
- **`_meta.phuketSeasonality`** — peak/shoulder/low calendar for Phuket (inverted vs Bali)
- **`_meta.phuketOwnershipNote`** — structural note on foreign-buyer eligibility (49% foreign-quota condos vs Thai company-held villas)
- **`_meta.currencyOverlay`** — USD/IDR (16,200 ref 2025 avg) + USD/THB (35.5 ref 2025 avg) with trend commentary, investor implication notes, yield-calculation rules under FX, hedging guidance
- **`_meta.operatorQualityMultipliers`** — top-quartile (1.15–1.30x median yield) / median (1.0x baseline) / bottom-quartile (0.65–0.80x) yield multipliers. Six characteristics per tier, typical revenue premiums, and four operator due-diligence questions
- **`predominantBedroomMix`** added to every sub-zone — what configurations actually trade there
- **`data/quarterly-retrospective.json`** —
  - **Annual snapshot 2025** — full-year mids for 9 sub-zones with `yoyDelta` vs 2024 and per-villa annual revenue figures
  - **Q4 2025 + Q1 2026 quarterly snapshots** — quarterly mids with `delta_vs_prior` blocks
  - **5 key findings** — corridor softening, Pererenan-arbitrage thesis holding, Bingin 1BR saturation, Nusa Dua low-variance, Ubud resilience
- CC BY 4.0 licence
- Python and Node.js example loaders
- Issue templates for data corrections and new sub-zone proposals

### Sources for v1.0.0 baselines

**Bali (primary):**
- AirDNA Bali short-term rental data (Q1 2026)
- Bali Tourism Board occupancy reports (2025 annual + Q1 2026)
- Statistics Indonesia (BPS) tourism arrivals (2025)
- Knight Frank Asia Pacific residential research (2025 H2)
- Global Property Guide Indonesia (2025 update)
- Internal observation of partner-agency transaction patterns (2024–Q1 2026)

**Phuket (secondary):**
- Knight Frank Phuket residential research (2025)
- Global Property Guide Thailand (2025)
- AirDNA Phuket overview (Q1 2026)
- Phuket Provincial Tourism Office arrivals data (2025)
- Editorial observation across the Bali Villa Select Phuket coverage

**Lombok (tertiary):**
- Knight Frank Lombok occasional reports (2024–2025)
- AirDNA Lombok overview (Q4 2025)
- Adjacent-market observation from Bali corridor patterns
- Editorial inference where direct data unavailable (clearly noted in `_doc` of each sub-zone)

### Known limitations

- **Lombok coverage is TERTIARY** — directional ranges only, low confidence. Liquidity is materially thinner than Bali; exit timelines should be assumed at 5–7 years rather than 2–3.
- **Phuket coverage is SECONDARY** — institutional research only, no direct transaction-level observation. Apply with extra caution.
- 4BR+ luxury villa yields use systemic delta (`_meta.bedroomYieldAdjustments`) rather than per-zone explicit ranges; insufficient transaction volume per sub-zone to support per-zone 4BR breakouts.
- Long-term lease yields not modelled (this dataset is short-term rental focused). Long-term lease yields generally run 4-7% gross.
- Phuket and Lombok retrospective snapshots not included in v1.0.0 (insufficient direct quarterly data at our confidence threshold).
- Operator-quality multipliers are systemic rather than per-zone. Operator-tier distribution may differ by corridor (e.g. Berawa has higher concentration of top-quartile operators than emerging sub-zones), but quantifying that distribution per zone is beyond v1.0.0 scope.

### Contributors

- Bali Villa Select editorial desk (initial release)
