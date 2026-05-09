# Push this repo to GitHub — step-by-step

**Note:** this file is for the maintainer (you) only — delete it before the first public commit, OR leave it as `PUSH-TO-GITHUB.md` for future reference (it's harmless to public visitors).

## Pre-flight

You'll need:

1. A GitHub account (use the one for the brand or your founder account)
2. `git` installed locally
3. (Recommended) GitHub CLI: `gh` — makes repo creation and topic-setting one command

## Step 1 — Create the GitHub repository

### Option A: GitHub CLI (recommended, 1 minute)

```bash
cd c:/Users/MAXIMATOR/Documents/balivillaselect/oss/bali-corridor-yields

# Initialise git
git init -b main
git add .
git commit -m "Initial public release v1.0.0 — 17 sub-zones across 5 Bali corridors"

# Create the public repo + push (gh pulls metadata from package files; we have none, so we set --description)
gh repo create bali-villa-select/bali-corridor-yields \
  --public \
  --source=. \
  --description="Open dataset of stabilised year-2 rental yield ranges for Bali property corridors. Maintained by the Bali Villa Select editorial desk." \
  --homepage="https://balivillaselect.com" \
  --push

# Add discoverability topics
gh repo edit bali-villa-select/bali-corridor-yields \
  --add-topic bali \
  --add-topic indonesia \
  --add-topic real-estate \
  --add-topic property-data \
  --add-topic vacation-rental \
  --add-topic airbnb \
  --add-topic open-data \
  --add-topic dataset \
  --add-topic rental-yield \
  --add-topic proptech
```

If the org `bali-villa-select` doesn't exist yet, create it free at https://github.com/account/organizations/new (use the brand email). Or push under your personal handle: replace `bali-villa-select/` with `<your-handle>/`.

### Option B: Web UI (no CLI)

1. Go to https://github.com/new
2. Repository name: `bali-corridor-yields`
3. Description: `Open dataset of stabilised year-2 rental yield ranges for Bali property corridors`
4. Public
5. **Do NOT** initialise with README/.gitignore/licence — we already have all three
6. Click "Create repository"
7. Copy the suggested git remote URL
8. Locally run:

```bash
cd c:/Users/MAXIMATOR/Documents/balivillaselect/oss/bali-corridor-yields
git init -b main
git add .
git commit -m "Initial public release v1.0.0 — 17 sub-zones across 5 Bali corridors"
git remote add origin https://github.com/<owner>/bali-corridor-yields.git
git push -u origin main
```

9. On the GitHub repo page, click the gear icon next to "About" and add topics:
   `bali, indonesia, real-estate, property-data, vacation-rental, airbnb, open-data, dataset, rental-yield, proptech`

## Step 2 — Polish the public face

After pushing, on the repo page:

- **Set the homepage URL** to `https://balivillaselect.com` (gear icon next to "About")
- **Pin the description** about the dataset (also in About)
- **Enable Discussions** (Settings → General → Features → Discussions). Encourages community engagement and creates more indexable content.
- **Disable Wikis** if not used (avoids spam)
- **Set up branch protection** on `main` (Settings → Branches): require PRs, require linear history. Keeps the data history clean.

## Step 3 — Submit to awesome-lists (this is where the backlinks come from)

GitHub awesome-lists are curated catalogues. Each merged PR adding your repo to one is a high-DA dofollow backlink.

Targets to PR (each takes 5-10 minutes):

| List | Repo | What you submit |
|---|---|---|
| awesome-investing | `jyguilp/awesome-investing` | Bali corridor yields dataset |
| awesome-real-estate | search "awesome-real-estate" | Same |
| awesome-indonesia | search "awesome-indonesia" | Same |
| awesome-public-datasets | `awesomedata/awesome-public-datasets` | Real Estate section |
| awesome-proptech | search "awesome-proptech" | Same |
| awesome-airbnb | search "awesome-airbnb-data" or similar | Same |
| awesome-tourism | search "awesome-tourism-data" | Bali tourism context |
| awesome-data | `awesomedata/awesome-public-datasets` | Real estate section |
| awesome-finance | search "awesome-finance-data" | Investment data |

PR title pattern:

```
Add Bali Corridor Yields — open dataset of Bali property yields
```

PR body pattern (paste into PR description):

```markdown
Adds [Bali Corridor Yields](https://github.com/bali-villa-select/bali-corridor-yields) — an open dataset of stabilised year-2 rental yield ranges for 17 sub-zones across 5 Bali corridors (Canggu, Bukit, Seminyak, Ubud, Sanur).

Includes:
- Editorial-grade gross/net yield ranges
- Occupancy and ADR (peak / shoulder / low season)
- Entry-price ranges by sub-zone
- Source-tier methodology (BPS, Bank Indonesia, AirDNA, Knight Frank)
- CC BY 4.0 licensed
- Python + Node.js example loaders included
- Refreshed quarterly

Useful for: prop-tech developers, real-estate researchers, journalists covering international property, individual investors evaluating Bali villa purchases.
```

## Step 4 — Tracking

Add to your backlink tracking sheet:

| Date | Channel | Source | Action | Status | Backlink? |
|---|---|---|---|---|---|
| 2026-05-09 | GitHub | own repo | repo created | live | DA 96 to balivillaselect.com (homepage) |
| 2026-05-XX | GitHub | awesome-investing | PR | (pending) | – |

After 14 days, run `node worker/scripts/bing-webmaster.mjs links` from the main project to see if the new backlinks have been picked up by Bing.

## Step 5 — Promote

Now that the repo is live:

1. **Twitter/X:** Post a thread announcing the open dataset. "We open-sourced our internal Bali corridor yield baselines under CC BY 4.0..." Include screenshots of the underwrite-villa example output.

2. **Reddit r/datasets:** A genuine "we open-sourced our internal data" post, with no spammy CTA. Subreddit appreciates the openness.

3. **Hacker News Show HN:** "Show HN: Open dataset of Bali property yields (CC BY 4.0)". Submit URL = the repo, not the homepage.

4. **Indie Hackers:** "We open-sourced our biggest competitive moat (and why)". Founders love this story.

Each promotion drives stars and forks. Stars rank the repo higher in GitHub search. More engagement → more backlinks over time.

## Maintenance

Quarterly refresh:

1. Update numbers based on new AirDNA / market data
2. Bump `_meta.version` (patch for tweaks, minor for new sub-zones)
3. Update `_meta.lastUpdated`
4. Add CHANGELOG entry
5. `git commit -m "vX.Y.Z — Q[N] [year] refresh"`
6. `git push` + create release tag in GitHub: `gh release create vX.Y.Z`

Each release = a fresh signal to people who star or watch the repo. Watchers get notifications; stars rebuild interest.

## When to delete this file

This `PUSH-TO-GITHUB.md` is internal-facing. Two options:

- **Delete before first commit:** the public repo never sees it. Cleanest.
- **Leave as-is:** harmless to visitors and serves as future maintenance reference. We chose this because future-you will thank current-you.

If you want to delete:

```bash
rm PUSH-TO-GITHUB.md
git add -A
git commit -m "Remove internal push instructions"
git push
```
