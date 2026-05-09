/**
 * Example loader for the Bali corridor yields dataset (Node 18+ / browsers).
 *
 * Demonstrates:
 *   - Fetching the dataset directly from GitHub (works in Node 18+ and browsers)
 *   - Loading from local file (Node only)
 *   - Computing corridor-level summaries
 *   - Comparing two sub-zones
 *   - Underwriting a new villa against corridor baselines
 *
 * No external dependencies. ES modules.
 */

import { readFile } from 'node:fs/promises'

const GITHUB_URL =
  'https://raw.githubusercontent.com/bali-villa-select/' +
  'bali-corridor-yields/main/data/bali-corridor-yields.json'

// ─── Loaders ──────────────────────────────────────────────────────────

export async function loadRemote() {
  const res = await fetch(GITHUB_URL)
  if (!res.ok) throw new Error(`Failed to fetch dataset: ${res.status}`)
  return res.json()
}

export async function loadLocal(path = 'data/bali-corridor-yields.json') {
  const text = await readFile(path, 'utf8')
  return JSON.parse(text)
}

// ─── Helpers ──────────────────────────────────────────────────────────

const median = (arr) => {
  const sorted = [...arr].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2
}

/** Mean of all numbers in an array (small helper). */
const mean = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length

/** Average gross yield and ADR across all sub-zones of a corridor. */
export function corridorSummary(data, corridor) {
  if (!data[corridor]) throw new Error(`Corridor not found: ${corridor}`)
  const subZones = Object.entries(data[corridor]).filter(
    ([, v]) => typeof v === 'object' && v.grossYieldRange
  )
  const grossLows = subZones.map(([, v]) => v.grossYieldRange[0])
  const grossHighs = subZones.map(([, v]) => v.grossYieldRange[1])
  const peakLows = subZones.map(([, v]) => v.adrPeak[0])
  const peakHighs = subZones.map(([, v]) => v.adrPeak[1])

  return {
    corridor,
    subZones: subZones.map(([k]) => k),
    grossYieldMedianLow: median(grossLows),
    grossYieldMedianHigh: median(grossHighs),
    adrPeakMedianLow: median(peakLows),
    adrPeakMedianHigh: median(peakHighs),
  }
}

/** Side-by-side comparison of two sub-zones. */
export function compareSubZones(data, corridorA, subA, corridorB, subB) {
  const a = data[corridorA][subA]
  const b = data[corridorB][subB]
  return {
    [`${corridorA}/${subA}`]: {
      tier: a.tier,
      gross: a.grossYieldRange,
      net: a.netYieldRange,
      occupancy: a.occupancyRange,
      entryPrice: a.entryPriceRange,
    },
    [`${corridorB}/${subB}`]: {
      tier: b.tier,
      gross: b.grossYieldRange,
      net: b.netYieldRange,
      occupancy: b.occupancyRange,
      entryPrice: b.entryPriceRange,
    },
  }
}

/**
 * Quick underwrite: estimate annual revenue and net yield for a villa,
 * applying a year-1 haircut by default (60-75% of stabilised → 70% midpoint).
 */
export function underwriteVilla(
  data,
  corridor,
  subZone,
  purchasePriceUSD,
  applyYearOneHaircut = true
) {
  const zone = data[corridor][subZone]
  const occMid = mean(zone.occupancyRange) / 100 // fraction
  const adrMid =
    mean([...zone.adrPeak, ...zone.adrShoulder, ...zone.adrLow])

  const revenueStabilised = adrMid * occMid * 365
  const revenue = revenueStabilised * (applyYearOneHaircut ? 0.7 : 1.0)

  const grossYield = (revenue / purchasePriceUSD) * 100
  const netLow = grossYield * 0.65 // 35% cost gap (high)
  const netHigh = grossYield * 0.75 // 25% cost gap (low)

  return {
    corridor,
    subZone,
    purchasePriceUSD,
    blendedADRMid: Number(adrMid.toFixed(2)),
    occupancyMid: Number((occMid * 100).toFixed(1)),
    estimatedRevenueUSD: Math.round(revenue),
    estimatedGrossYieldPct: Number(grossYield.toFixed(2)),
    estimatedNetYieldRangePct: [
      Number(netLow.toFixed(2)),
      Number(netHigh.toFixed(2)),
    ],
    yearOneHaircutApplied: applyYearOneHaircut,
    subZoneNotes: zone.notes,
  }
}

// ─── Demo ─────────────────────────────────────────────────────────────

const isMain = import.meta.url === `file://${process.argv[1]}`
if (isMain) {
  // Choose loader: local for offline work, remote for fresh data.
  // const data = await loadLocal()
  const data = await loadRemote()

  console.log(
    `Dataset version: ${data._meta.version} ` +
      `(last updated ${data._meta.lastUpdated})\n`
  )

  // Corridor summary
  const canggu = corridorSummary(data, 'Canggu')
  console.log(
    `Canggu summary: gross yield median ${canggu.grossYieldMedianLow}-` +
      `${canggu.grossYieldMedianHigh}%, peak ADR median ` +
      `$${canggu.adrPeakMedianLow}-$${canggu.adrPeakMedianHigh}/night\n`
  )

  // Compare two sub-zones
  const cmp = compareSubZones(
    data,
    'Canggu',
    'Berawa',
    'Bukit',
    'Bingin / Padang Padang'
  )
  console.log('Side-by-side comparison:')
  console.log(JSON.stringify(cmp, null, 2))
  console.log()

  // Underwrite a hypothetical villa
  const uw = underwriteVilla(data, 'Canggu', 'Berawa', 500_000)
  console.log('Underwrite — Berawa villa @ $500k, year 1:')
  console.log(`  Estimated revenue:  $${uw.estimatedRevenueUSD.toLocaleString()}/year`)
  console.log(`  Gross yield:        ${uw.estimatedGrossYieldPct}%`)
  console.log(
    `  Net yield range:    ${uw.estimatedNetYieldRangePct[0]}-` +
      `${uw.estimatedNetYieldRangePct[1]}%`
  )
  console.log(`  Note: ${uw.subZoneNotes}`)
  console.log()

  // Citation reminder
  console.log(`Citation: ${data._meta.citationText}`)
}
