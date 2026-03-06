# Arctic Clusters — Aurora Events: Web SDK Implementation Guide (v2)

## Overview

Aurora cells are a **position overlay system** in Arctic Clusters. Each spin, random positions on the 7×7 grid are marked as "aurora cells." When a winning cluster lands on an aurora cell, it **activates** — the aurora explodes and generates wild symbols that get placed on the board, potentially creating new wins in the tumble chain.

In Free Spins / Super Bonus, placed wilds that participate in subsequent winning clusters are counted on a **wild meter**. At the end of the bonus, all meter wilds are released onto a fresh board — but **natural clusters on the release board are evaluated first**, then the wilds are placed and the tumble chain continues.

The math engine (Rust optimizer) produces books containing sequential events. The web SDK must process them **in order by index** and render appropriate animations/state changes.

---

## Data Files

### RGS Compressed (production — used by the RGS server)

Located in `games/0_0_arctic_clusters/library/publish_files/`:

- `books_base.jsonl.zst` — Base mode storybooks (zstd-compressed, one JSON per line)
- `lookUpTable_base_0.csv` — Weight table for probabilistic book selection
- `index.json` — Mode index (maps mode names to file paths)
- `config.json` — Game configuration
- `config_fe_0_0_arctic_clusters.json` — Frontend bet mode configuration

### TypeScript Storybooks (for Storybook.js testing)

Located in `games/0_0_arctic_clusters/library/files_needed_for_storybook/`:

- `base_tumble_freespin_books.ts` — 5 books with tumble-triggered free spins + wild release
- `book_113_base_tumble_freespin.ts` — Single reference book (Book 113, 71.00×)

---

## Board Layout

- **7 reels × 9 rows** (7 active rows + 1 padding top + 1 padding bottom)
- All positions use `{reel, row}` where `reel` is 0-indexed (0–6) and `row` is 1-indexed including padding
  - Row 0 = top padding, Row 1–7 = active, Row 8 = bottom padding
- The `reveal` event's `board` is an array of 7 reels, each reel is an array of 9 `StorybookSymbol` objects

## Symbol Format

Each symbol in a `reveal` board:

```json
{
  "name": "H2",           // Symbol ID: H1-H4 (high), L1-L4 (low), W (wild), S (scatter), SS (super scatter)
  "aurora": true,          // OPTIONAL — present and true if this cell has an aurora overlay
  "multiplier": 4,         // OPTIONAL — present if position multiplier > 1
  "scatter": true,         // OPTIONAL — present on scatter symbols
  "wild": true             // OPTIONAL — present on wild symbols
}
```

**Key: when `aurora: true` is present on a symbol in the reveal board, render the aurora overlay behind/beneath that symbol.**

---

## All Event Types

The web SDK must handle these event types:

### Standard Events (already implemented)

| Event | Description |
|---|---|
| `reveal` | Board drop — show symbols. Has `gameType` field (`basegame`, `ante`, `freegame`, `super`, `freegame_wild_release`, `super_wild_release`) |
| `updateGrid` | Update multiplier grid display |
| `winInfo` | Winning cluster details with positions and amounts |
| `tumbleBoard` | Remove winning symbols, tumble down, refill from top |
| `updateTumbleWin` | Update running tumble win counter |
| `setWin` | Set spin win total |
| `setTotalWin` | Update session running total |
| `finalWin` | Final win amount for the entire book |
| `freeSpinTrigger` | 3+ scatters triggered free spins |
| `freeSpinRetrigger` | 3+ scatters during free spins — adds more spins |
| `superBonusTrigger` | 3+ super scatters triggered super bonus |
| `superBonusRetrigger` | 3+ super scatters during super bonus |
| `buyBonusTrigger` | Buy bonus purchased |
| `updateFreeSpin` | Show spin counter (e.g., "Spin 1/8") |
| `freeSpinEnd` | Bonus complete |
| `winCapReached` | 25000× win cap hit |

### Aurora Events (new)

| Event | Description |
|---|---|
| `auroraReveal` | Show aurora cell overlays on the board |
| `auroraMeterUpdate` | Update aurora meter UI (cells collected) |
| `auroraExplode` | Consume aurora cells that were in winning clusters |
| `auroraWildPlace` | Place a wild symbol from aurora activation or wild release |
| `auroraSpinStart` | Signal start of wild release phase with meter count |
| `wildRelease` | Announce how many wilds will be released |
| `wildMeterUpdate` | Update wild meter (wilds consumed back into meter from wins) |

---

## Aurora Event Schemas

### 1. `auroraReveal`

**When:** Immediately after a `reveal` event.

```json
{
  "type": "auroraReveal",
  "index": 1,
  "positions": [
    {"reel": 2, "row": 6},
    {"reel": 3, "row": 7},
    {"reel": 5, "row": 3}
  ]
}
```

**Web SDK action:**
- Render aurora cell overlays (glowing/pulsing background) at each position
- These match the `aurora: true` flags in the preceding `reveal` board
- Store these positions — they'll be referenced by later `auroraExplode` events

---

### 2. `auroraMeterUpdate`

**When:** After `updateTumbleWin`, when winning clusters overlapped aurora cells.

```json
{
  "type": "auroraMeterUpdate",
  "index": 6,
  "cellsCollected": 1,
  "meterTotal": 1
}
```

**Web SDK action:**
- Update the aurora meter UI with `meterTotal`
- Always appears immediately before its corresponding `auroraExplode` event
- The meter accumulates across all spins in a bonus session

---

### 3. `auroraExplode`

**When:** Immediately after `auroraMeterUpdate`.

```json
{
  "type": "auroraExplode",
  "index": 7,
  "positions": [
    {"reel": 4, "row": 2}
  ]
}
```

**Web SDK action:**
- Play explosion/activation animation on the aurora overlays at these positions
- Remove the aurora overlay from these cells (consumed — single use per spin)
- Wilds will be placed after the next `tumbleBoard` event

---

### 4. `auroraWildPlace`

**When:** Two contexts:

#### a) Mid-tumble placement (from aurora activation)

After a `tumbleBoard` event, when aurora-generated wilds are placed:

```json
{
  "type": "auroraWildPlace",
  "index": 9,
  "position": {"reel": 2, "row": 3},
  "meterBefore": 0,
  "meterAfter": 0,
  "isRelease": false
}
```

`meterBefore` and `meterAfter` are both 0 — these wilds come from aurora activation, not the meter bank. `isRelease` is `false`.

#### b) Wild release placement (end-of-bonus meter dump)

After `auroraSpinStart` + `wildRelease` events, and after any natural wins on the release board have been tumbled:

```json
{
  "type": "auroraWildPlace",
  "index": 74,
  "position": {"reel": 3, "row": 4},
  "meterBefore": 3,
  "meterAfter": 2,
  "isRelease": true
}
```

Each placement decrements the meter by 1. `isRelease` is `true`.

**Web SDK action:**
- Animate a wild symbol landing at `position`
- Replace the existing symbol at that position with a Wild (`W`)
- If `isRelease: true`, animate the wild meter counting down
- After all `auroraWildPlace` events are processed, the tumble loop continues

---

### 5. `auroraSpinStart`

**When:** During the wild release phase, after natural wins on the release board have been evaluated and tumbled. This event signals the start of wild placement.

```json
{
  "type": "auroraSpinStart",
  "index": 72,
  "totalWildsCollected": 3
}
```

**Web SDK action:**
- Show the wild release phase UI (e.g., "Wild Release!" banner)
- Display `totalWildsCollected` as the starting meter count
- The next event will be `wildRelease`, followed by individual `auroraWildPlace` events

---

### 6. `wildRelease`

**When:** Immediately after `auroraSpinStart`, announces how many wilds will be placed.

```json
{
  "type": "wildRelease",
  "index": 73,
  "wildsToPlace": 3
}
```

**Web SDK action:**
- Prepare for `wildsToPlace` sequential wild placement animations
- This is informational — actual placements come via `auroraWildPlace` events

---

### 7. `wildMeterUpdate`

**When:** After a tumble in free spins / super bonus, when placed wilds participated in winning clusters and were consumed back into the meter.

```json
{
  "type": "wildMeterUpdate",
  "index": 53,
  "consumedPositions": [
    {"reel": 2, "row": 4},
    {"reel": 2, "row": 3},
    {"reel": 1, "row": 4}
  ],
  "delta": 3,
  "meterBefore": 0,
  "meterAfter": 3
}
```

**Web SDK action:**
- Show wilds at `consumedPositions` being absorbed into the wild meter
- Update wild meter display from `meterBefore` to `meterAfter`
- `delta` is the number of wilds consumed (= `meterAfter - meterBefore`)
- These wilds will be released at end of bonus via the wild release phase

---

## Event Flow Per Spin

### Base Game / Free Spin / Super Bonus Spin:

```
1. reveal                    → Drop board, show symbols
2. auroraReveal              → Show aurora overlays on marked cells
3. [TUMBLE LOOP START]
   a. updateGrid             → Show current multiplier state
   b. winInfo                → Highlight winning clusters, show win amount
   c. updateGrid             → Show doubled multipliers at win positions
   d. updateTumbleWin        → Update running win counter
   e. auroraMeterUpdate      → (if aurora hit) Update meter UI
   f. auroraExplode          → (if aurora hit) Explode aurora cells
   g. tumbleBoard            → Remove winning symbols, tumble down, refill
   h. auroraWildPlace ×N     → (if aurora activated) Place wild(s) on board
   [LOOP BACK TO 3a if new wins exist]
4. setWin                    → Show spin win total
5. wildMeterUpdate           → (if wilds consumed into meter) Update wild meter
6. setTotalWin               → Update session running total
```

### Wild Release Phase (end of bonus):

**CRITICAL: Natural wins are evaluated FIRST, before wilds are placed.**

```
1. reveal (gameType=freegame_wild_release)    → New board for release
2. [NATURAL WINS — tumble loop for any pre-existing clusters]
   a. updateGrid
   b. winInfo                                 → Natural clusters (no wilds yet)
   c. updateGrid
   d. updateTumbleWin
   e. tumbleBoard
3. auroraSpinStart                            → Signal release phase start
4. wildRelease                                → Announce wilds count
5. auroraWildPlace ×N                         → Place wilds (meter counts down)
6. [TUMBLE LOOP — evaluate wild-boosted wins]
   a. updateGrid
   b. winInfo                                 → Clusters formed by wilds
   c. updateGrid
   d. updateTumbleWin
   e. tumbleBoard
   [LOOP if more wins]
7. setWin                                     → Wild release spin total
8. setTotalWin                                → Session total
9. freeSpinEnd                                → Bonus complete
10. finalWin                                  → Final win
```

### Free Spin Flow:

```
freeSpinTrigger                → Trigger animation, show total spins
setTotalWin                    → Running total
  updateFreeSpin               → "Spin 1/8"
  [SPIN CYCLE as above]
  updateFreeSpin               → "Spin 2/8"
  [SPIN CYCLE as above]
  ...
  updateFreeSpin               → "Spin 8/8"
  [SPIN CYCLE as above]
  [WILD RELEASE as above]     → (if wild meter > 0)
  freeSpinEnd
  finalWin
```

---

## Reference Book 113 — Complete Event Flow

Book 113: base mode, 71.00× (7100 cents), 91 events. Demonstrates tumble-triggered free spins + corrected wild release ordering.

```
[0]   reveal basegame               — Base spin: L2x5 cluster + 2 SC on initial board
[1]   auroraReveal 4 positions
[2-5] updateGrid → winInfo L2x5=20 → updateGrid → updateTumbleWin 20
[6]   auroraMeterUpdate cells=1 total=1   — 1 aurora cell in the winning cluster
[7]   auroraExplode 1 position
[8]   tumbleBoard                    — Tumble removes L2x5, refill drops 3rd SC
[9]   auroraWildPlace (2,3) meter:0>0    — 2 wilds placed from aurora activation
[10]  auroraWildPlace (5,7) meter:0>0
[11]  setWin 20
[12]  freeSpinTrigger totalFs=8      — 3 SC accumulated via tumbles → 8 free spins
[13]  setTotalWin 20

--- FREE SPINS 1-4: no wins ---
[14]  updateFreeSpin 1/8
[15]  reveal freegame
[16]  auroraReveal 3 positions
[17]  setTotalWin 20
... (FS 2-4 same pattern: reveal, auroraReveal, setTotalWin)

--- FREE SPIN 5: big win with aurora ---
[30]  updateFreeSpin 5/8
[31]  reveal freegame
[32]  auroraReveal 2 positions
[33-36] updateGrid → winInfo H2x6=200,L1x6=80 → updateGrid → updateTumbleWin 280
[37]  auroraMeterUpdate cells=2 total=3   — 2 more aurora cells hit, meter now 3
[38]  auroraExplode 2 positions
[39]  tumbleBoard
[40-45] auroraWildPlace ×6 (meter:0>0)    — 6 wilds placed from aurora
[46-50] updateGrid → winInfo H1x9=3800,L1x5=360 → updateGrid → updateTumbleWin 4440 → tumbleBoard
[51]  setWin 4440
[52]  setTotalWin 4460
[53]  wildMeterUpdate delta=3 meter:0>3   — 3 wilds participated in wins → added to meter

--- FREE SPINS 6-8: no wins ---
... (reveal, auroraReveal, setTotalWin)

--- WILD RELEASE (the fix!) ---
[66]  reveal freegame_wild_release         — Fresh board dropped
      ** NATURAL WINS EVALUATED FIRST: **
[67]  updateGrid
[68]  winInfo H1x5=600                     — Polar bear cluster on LEFT SIDE (natural, no wilds)
[69]  updateGrid
[70]  updateTumbleWin 600
[71]  tumbleBoard                          — Natural cluster tumbled away

      ** WILDS PLACED AFTER NATURAL WINS: **
[72]  auroraSpinStart totalWildsCollected=3
[73]  wildRelease wildsToPlace=3
[74]  auroraWildPlace (3,4) meter:3>2 release=True
[75]  auroraWildPlace (3,6) meter:2>1 release=True
[76]  auroraWildPlace (3,5) meter:1>0 release=True

      ** WILD-BOOSTED WINS: **
[77]  updateGrid
[78]  winInfo H1x7=1120, H2x6=200, H3x5=120, L1x6=400  — Massive clusters with wilds
[79]  updateGrid
[80]  updateTumbleWin 2440
[81]  tumbleBoard
[82-86] updateGrid → winInfo L2x5=200 → updateGrid → updateTumbleWin 2640 → tumbleBoard
[87]  setWin 2640
[88]  setTotalWin 7100
[89]  freeSpinEnd
[90]  finalWin 7100
```

**Key Observation:** Events [67-71] show the H1×5 polar bear cluster being paid **before** any wilds are placed. The wilds at [74-76] then create additional clusters evaluated at [77-86]. This is the correct ordering — natural wins first, then wild release.

---

## Event Type Summary Table (Book 113)

| Event Type | Count | Position Field | Key Animation |
|---|---|---|---|
| `reveal` | 10 | `board` (7×9 grid) | Drop symbols |
| `auroraReveal` | 9 | `positions[]` (array) | Show glowing overlays |
| `auroraMeterUpdate` | 2 | N/A (meter data) | Update aurora meter UI |
| `auroraExplode` | 2 | `positions[]` (array) | Explode/consume overlays |
| `auroraWildPlace` | 11 (8 mid-tumble + 3 release) | `position` (single) | Wild symbol landing |
| `auroraSpinStart` | 1 | N/A | Wild release phase banner |
| `wildRelease` | 1 | N/A | Announce wilds to place |
| `wildMeterUpdate` | 1 | `consumedPositions[]` | Wilds absorbed into meter |
| `winInfo` | 6 | `wins[].positions[]` | Highlight clusters |
| `tumbleBoard` | 6 | `explodingSymbols[]` | Remove & refill |

---

## Key Implementation Notes

1. **Aurora overlays are behind symbols** — render as a background glow/effect, not as a separate symbol
2. **Single-use per spin** — once an aurora cell activates (explodes), it's gone for that spin; new ones come via next `auroraReveal`
3. **Wilds placed after tumble** — `auroraWildPlace` happens AFTER `tumbleBoard`; the wild replaces whatever is at that position
4. **Wild placement continues tumble loop** — after wilds are placed, the engine checks for new wins; if the new wilds form clusters, the tumble loop continues
5. **Wild release: natural wins first** — on the `freegame_wild_release` reveal, any natural clusters are evaluated/tumbled BEFORE `auroraSpinStart` / `wildRelease` / `auroraWildPlace` events. The web SDK must handle win events before the release header.
6. **Position coordinates** — `reel` is 0-based (0–6), `row` includes padding so active rows are 1–7
7. **All amounts are in cents** — divide by 100 for display currency
8. **`aurora` field on symbols** — only present when `true`; absent (not `false`) when there's no aurora
9. **`isRelease` on `auroraWildPlace`** — `true` for wild release phase, `false` for mid-tumble aurora placements. Use this to determine animation style (meter countdown vs. aurora-generated).
10. **`wildMeterUpdate`** — only appears in free spins / super bonus. Shows which wilds were consumed into the meter after participating in wins. The wild meter accumulates across the entire bonus session and is released at the end.
11. **No `wildMultiplier` event** — v6 does NOT have wild multipliers. Position multipliers (from `updateGrid`) apply to all symbols including wilds. Each winning position doubles its multiplier after each win.
12. **Wilds can participate in multiple clusters** — a single wild at one position can be counted in two or more winning clusters simultaneously. Don't remove it after one cluster check.
13. **gameType field on reveal** — identifies the phase:
    - `basegame` / `ante` — base game spin
    - `freegame` — free spin
    - `super` — super bonus spin
    - `freegame_wild_release` / `super_wild_release` — wild release (final spin)
