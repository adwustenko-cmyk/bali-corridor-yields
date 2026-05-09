---
name: New sub-zone proposal
about: Propose a new Bali sub-zone be added to the dataset
title: 'New sub-zone: [Corridor] / [Sub-zone name]'
labels: 'new-data'
assignees: ''
---

## Proposed sub-zone

- **Corridor parent:** (e.g. `Canggu`, `Bukit`, or new corridor)
- **Proposed sub-zone name:** (the canonical local-vernacular name)

## Editorial distinction

Why is this sub-zone editorially distinct from existing entries in the dataset? What investor-segment fit, what corridor positioning, what trade-off makes it not a fit for an existing entry?

(2–4 sentences)

## Volume threshold

Approximately how many transacting villas per year in this sub-zone? (We won't add sub-zones below ~50/year — yields thin out below this threshold and editorial confidence drops.)

## Proposed values

Fill in all eight required fields:

```json
{
  "Corridor Name": {
    "Sub-zone Name": {
      "tier": "(premium / mid-tier / emerging / scarcity / etc.)",
      "grossYieldRange": [low, high],
      "netYieldRange": [low, high],
      "occupancyRange": [low, high],
      "adrPeak": [low, high],
      "adrShoulder": [low, high],
      "adrLow": [low, high],
      "entryPriceRange": [low, high],
      "notes": "(2-3 sentence editorial commentary on what drives yield + key trade-offs)"
    }
  }
}
```

## Sources

For each numeric field, what sources back the proposed range?

- **grossYieldRange / netYieldRange:** (e.g. AirDNA report, Knight Frank, observed transactions)
- **occupancyRange:** (e.g. Bali Tourism Board, AirDNA occupancy)
- **adrPeak / adrShoulder / adrLow:** (e.g. AirDNA, public listing platform observation)
- **entryPriceRange:** (e.g. recent transaction data, public listing aggregation)

## Author / contact

GitHub handle, if you'd like attribution in the CHANGELOG when this is added:
