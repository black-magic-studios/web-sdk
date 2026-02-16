# Arctic Clusters — Batch Output (Storybook Files)

## Overview

This directory contains pre-simulated game outcomes ("storybooks") and lookup tables for the Arctic Clusters slot game. These are used by the web SDK to replay deterministic game rounds without running the math engine in real-time.

The game is a **7×7 cluster-pays** slot with tumble mechanics, aurora wilds, free spins, and super bonus features.

There are **10 multiplier-base modes** (M2X through M1024X), each with its own spin price and reel configuration. Every cell on the board starts at the given multiplier (e.g. M4X = every cell starts at 4x). There is also a **base game** mode (files at the root of this directory) with no starting multiplier.

---

## Directory Structure

```
batch_output/
├── README.md                          ← You are here
├── lookUpTable_0_0.csv                ← Base game LUT (weighted outcome table)
├── lookUpTable_0_0_detailed.csv       ← Base game LUT with detailed breakdown
├── summary.json                       ← Base game simulation summary
├── weight_optimization_summary.txt    ← Base game weight optimization log
│
├── M2X/                               ← 2x multiplier-base mode
│   ├── books_batch_0.json.gz          ← Storybook batch (1000 books per file)
│   ├── books_batch_1.json.gz
│   ├── ...                            ← 100 batch files total (100,000 books)
│   ├── lookUpTable_0_0.csv            ← Weighted lookup table for SDK
│   ├── lookUpTable_0_0_detailed.csv   ← Detailed LUT with RTP breakdown
│   ├── summary.json                   ← Simulation stats (RTP, hit rate, etc.)
│   └── weight_optimization_summary.txt
│
├── M4X/                               ← 4x multiplier-base mode
├── M8X/                               ← 8x multiplier-base mode
├── M16X/                              ← 16x multiplier-base mode
├── M32X/                              ← 32x multiplier-base mode
├── M64X/                              ← 64x multiplier-base mode
├── M128X/                             ← 128x multiplier-base mode
├── M256X/                             ← 256x multiplier-base mode
├── M512X/                             ← 512x multiplier-base mode
└── M1024X/                            ← 1024x multiplier-base mode
```

---

## Spin Prices Per Mode

Each multiplier mode has a different spin price (cost to play). The price is a multiple of the base bet:

| Mode   | Spin Price | Starting Cell Multiplier |
|--------|-----------|--------------------------|
| Base   | 1.0x      | 1x (no multiplier)       |
| M2X    | 2.9x      | 2x                       |
| M4X    | 5.8x      | 4x                       |
| M8X    | 11.2x     | 8x                       |
| M16X   | 23.0x     | 16x                      |
| M32X   | 46.2x     | 32x                      |
| M64X   | 90.6x     | 64x                      |
| M128X  | 181.8x    | 128x                     |
| M256X  | 354.5x    | 256x                     |
| M512X  | 665.1x    | 512x                     |
| M1024X | 1110.8x   | 1024x                    |

---

## Storybook Files (`books_batch_*.json.gz`)

### Loading

Each file is **gzip-compressed JSON**. Decompress with any gzip library:

```javascript
// Node.js
const zlib = require('zlib');
const fs = require('fs');
const data = JSON.parse(zlib.gunzipSync(fs.readFileSync('books_batch_0.json.gz')));

// Browser (fetch + DecompressionStream)
const res = await fetch('books_batch_0.json.gz');
const ds = new DecompressionStream('gzip');
const reader = res.body.pipeThrough(ds).getReader();
// ... read and parse JSON
```

### Structure

Each `.json.gz` file contains a **JSON array of 1,000 book objects**. Each book represents one complete spin outcome (base game + any triggered bonus rounds).

```jsonc
{
  "id": 42,                    // Sequential ID within the batch
  "payoutMultiplier": 1540,    // Total win in cents (divide by 100 for multiplier)
  "events": [ ... ],           // Ordered array of visual events to replay
  "criteria": "freegame",      // Outcome category: "0", "basegame", or "freegame"
  "baseGameWins": 200,         // Win from base game tumbles (in cents)
  "freeGameWins": 1340         // Win from free spins + super bonus (in cents)
}
```

**Key fields:**

- **`payoutMultiplier`**: The total raw win in **hundredths** (cents). Divide by 100 to get the win multiplier relative to base bet. For mult modes, this is the **raw** win (before dividing by price). The effective win the player sees = `payoutMultiplier / 100 / spinPrice`.
- **`criteria`**: Which category this outcome falls into:
  - `"0"` — No win (dead spin)
  - `"basegame"` — Win from base game only (no bonus triggered)
  - `"freegame"` — Free spins or super bonus was triggered
- **`baseGameWins`** / **`freeGameWins`**: Breakdown of where the win came from (both in cents).

### Event Types

The `events` array contains ordered visual events your SDK should replay sequentially. Each event has a `"type"` field:

| Event Type | Description |
|---|---|
| `reveal` | Initial board reveal — contains the full 7×7 `board` grid with symbol names, multipliers, aurora flags, and scatter flags. Also contains `index` (tumble round number, 0 = initial). |
| `auroraReveal` | Reveals which cells have the aurora feature active. |
| `winInfo` | Cluster win information — which symbols formed clusters, positions, and win amounts. |
| `updateGrid` | Grid state update after clusters are removed (cells marked for removal). |
| `updateTumbleWin` | Running tumble win total update. |
| `tumbleBoard` | New symbols tumble/fall into empty positions. |
| `auroraExplode` | Aurora feature activates — surrounding cells get multiplier upgrades. |
| `auroraMeterUpdate` | Aurora meter progress update. |
| `auroraWildPlace` | Aurora wild symbol placement on the board. |
| `setWin` | Sets the current phase win amount. |
| `setTotalWin` | Updates the running total win. |
| `freeSpinTrigger` | Free spins bonus triggered (3+ scatters). |
| `updateFreeSpin` | Free spin round counter update. |
| `freeSpinEnd` | Free spins bonus complete. |
| `finalWin` | Final win amount for the entire spin. |

### Board Cell Format

Each cell in a `reveal` event's `board` array:

```jsonc
{
  "name": "H1",           // Symbol: H1-H4 (high), L1-L4 (low), W (wild), SC (scatter), SS (super scatter)
  "multiplier": 4,        // Cell multiplier (present on inner cells for mult modes)
  "aurora": true,         // Optional: cell has aurora feature
  "scatter": true         // Optional: cell is a scatter/super scatter
}
```

**Board layout**: The `board` is a 7×7 grid represented as `board[row][col]`. The outer ring (row 0, row 6, col 0, col 8) has **no multiplier** — only the inner 5×7 cells carry multipliers.

---

## Lookup Table (`lookUpTable_0_0.csv`)

This is the **weighted random selection table** your SDK uses at runtime to pick which storybook to serve.

### Format (3 columns, no header):

```
id,weight,payoutMultiplier
0,5741004121,34
1,12914363574,0
2,5741004121,441
```

- **`id`**: Row index (matches the book's position: `id / 1000` = batch file number, `id % 1000` = index within batch)
- **`weight`**: Integer weight for weighted random selection. Higher weight = more likely to be picked.
- **`payoutMultiplier`**: The **effective** payout in cents (raw win adjusted for price). This is what the player actually wins.

### How to Use

1. Sum all weights in the CSV.
2. Generate a random number from 0 to total_weight - 1.
3. Walk through entries, accumulating weights, until you find the selected row.
4. Use the `id` to locate the storybook: batch file = `books_batch_{id / 1000}.json.gz`, index within batch = `id % 1000`.
5. Replay the events from that book.

---

## Detailed Lookup Table (`lookUpTable_0_0_detailed.csv`)

Same as above but with extra columns for debugging and analysis:

```
id,weight,total_win,base_win,free_win,super_win,criteria
0,5741004121,0.34,0.34,0.00,0.00,basegame
1,12914363574,0.00,0.00,0.00,0.00,0
```

- **`total_win`**: Effective total win as a multiplier (win / price)
- **`base_win`** / **`free_win`** / **`super_win`**: RTP contribution breakdown
- **`criteria`**: Outcome category

---

## Summary Files

### `summary.json`

Machine-readable simulation statistics:

```jsonc
{
  "mult_level": 2,              // Multiplier level (2 = M2X)
  "spin_price": 2.9,            // Spin price multiplier
  "rtp": 0.925,                 // Effective RTP (target: 92.5%)
  "base_rtp": 0.45,             // Base game RTP contribution
  "free_rtp": 0.35,             // Free spins RTP contribution  
  "super_rtp": 0.125,           // Super bonus RTP contribution
  "hit_rate": 0.2648,           // % of spins that win something
  "fs_trigger_rate": 0.00541,   // Free spin trigger frequency
  "max_raw_win": 3006.4,        // Highest raw win seen in sim
  "max_effective_win": 1036.69, // Highest effective win (raw / price)
  "books_generated": 100000,    // Total storybooks available
  "total_spins": 100000,        // Spins simulated
  "zero_wins": 73516            // Dead spin count
}
```

### `weight_optimization_summary.txt`

Human-readable log of the weight optimization process.

---

## Quick Start for Your Agent

1. **Pick a multiplier mode** (e.g. M4X for testing).
2. **Load the LUT**: Parse `M4X/lookUpTable_0_0.csv` into memory.
3. **On each spin request**:
   - Weighted random select a row from the LUT.
   - Compute batch file: `books_batch_{Math.floor(id / 1000)}.json.gz`
   - Compute book index: `id % 1000`
   - Decompress and parse the batch file (cache after first load).
   - Return the book's `events` array to the client for visual replay.
   - The player's win = LUT row's `payoutMultiplier / 100 * baseBet`.
4. **Replay events** in the client in order — each event type maps to a visual animation step.

---

## Important Notes

- The **win cap** is 25,000x base bet (raw). At higher mult levels (64x+), this cap is frequently hit.
- All wins in storybook `payoutMultiplier` are **raw** (not divided by price). The LUT `payoutMultiplier` column is **effective** (already divided by price).
- Storybook files are ~150 KB each (compressed). Each batch has 1,000 books. Total per mode: ~15 MB of storybooks.
- The outer ring of the 7×7 board (border cells) does not have multipliers — only the inner 5×7 area does.
- Symbols: `H1`, `H2`, `H3`, `H4` (high pay), `L1`, `L2`, `L3`, `L4` (low pay), `W` (wild), `SC` (scatter), `SS` (super scatter).
- Minimum cluster size for a win: **5 connected symbols** (orthogonal adjacency).
