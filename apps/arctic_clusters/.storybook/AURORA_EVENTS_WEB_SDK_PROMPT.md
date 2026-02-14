# Arctic Clusters — Aurora Cell Events: Web SDK Implementation Guide

## Overview

Aurora cells are a **position overlay system** in Arctic Clusters. Each spin, random positions on the 7×7 grid are marked as "aurora cells." When a winning cluster lands on an aurora cell, it **activates** — the aurora explodes and generates wild symbols that get placed on the board, potentially creating new wins in the tumble chain.

The math engine (Rust optimizer) produces books containing these events. The web SDK must process them in order and render appropriate animations/state changes.

---

## Files to Install

Copy these files into your web SDK arctic_clusters app:

1. **`story_aurora_freespin.ts`** → `apps/arctic_clusters/src/stories/data/story_aurora_freespin.ts`
   - TypeScript data file exporting `story_aurora_freespin` — a single book object with 181 events
   - Book id: 915157, payout: 289480 cents (2894.80×), criteria: "freegame"

2. **`StoryAuroraFreespin.stories.svelte`** → `apps/arctic_clusters/src/stories/StoryAuroraFreespin.stories.svelte`
   - Storybook story file that imports the data and plays it via `playBet({ ...data, state: data.events })`
   - Shows up in Storybook under "Books / Aurora Freespin"

This book covers a basegame spin triggering 8 free spins, with all 4 aurora event types: 9 `auroraReveal`, 8 `auroraMeterUpdate`, 8 `auroraExplode`, 33 `auroraWildPlace`.

---

## New Events to Handle

The web SDK already handles: `reveal`, `updateGrid`, `winInfo`, `tumbleBoard`, `updateTumbleWin`, `setWin`, `setTotalWin`, `finalWin`, `freeSpinTrigger`, `freeSpinEnd`, `updateFreeSpin`.

The **4 new event types** that need to be implemented are all aurora-related and are described below.

---

## Board Layout

- **7 reels × 9 rows** (7 active rows + 1 padding top + 1 padding bottom)
- All positions use `{reel, row}` where `reel` is 0-indexed (0–6) and `row` is 1-indexed including padding (row 1 = top active, row 7 = bottom active; row 0 and row 8 are padding)
- The `reveal` event's `board` is an array of 7 reels, each reel is an array of 9 `StorybookSymbol` objects

## Symbol Format

Each symbol in a `reveal` board event is:

```json
{
  "name": "H2",           // Symbol ID: H1-H4, L1-L4, W (wild), S (scatter), SS (super scatter)
  "aurora": true,          // OPTIONAL — only present (and true) if this cell has an aurora overlay
  "multiplier": 4,         // OPTIONAL — only present if position multiplier > 1
  "scatter": true,         // OPTIONAL — only present on scatter symbols
  "wild": true             // OPTIONAL — only present on wild symbols
}
```

**Key: when `aurora: true` is present on a symbol in the reveal board, render the aurora overlay behind/beneath that symbol.**

---

## Aurora Event Types (4 total)

Events are processed **sequentially by index**. Here is each aurora event type with its schema and what the web SDK should do:

### 1. `auroraReveal`

**When:** Immediately after a `reveal` event (board drop animation complete).

```json
{
  "type": "auroraReveal",
  "index": 1,
  "positions": [
    {"reel": 1, "row": 1},
    {"reel": 4, "row": 6},
    {"reel": 6, "row": 4}
  ]
}
```

**Fields:**
- `positions` — Array of `{reel, row}` grid positions where aurora cells are placed

**Web SDK action:**
- Render aurora cell overlays at each position (glowing/pulsing background effect)
- These are the same positions flagged with `aurora: true` on symbols in the preceding `reveal` board
- Aurora cells are visual overlays — they sit behind/beneath the symbol on the same cell
- Store these positions in state; they'll be referenced by later `auroraExplode` events

---

### 2. `auroraMeterUpdate`

**When:** After a `winInfo` event, when winning clusters overlap aurora cell positions.

```json
{
  "type": "auroraMeterUpdate",
  "index": 15,
  "cellsCollected": 1,
  "meterTotal": 0
}
```

**Fields:**
- `cellsCollected` — How many aurora cells were activated in this tumble step
- `meterTotal` — Running total of aurora cells collected (for the aurora meter UI)

**Web SDK action:**
- Update the aurora meter UI (if displayed) with `meterTotal`
- This event always appears immediately before its corresponding `auroraExplode` event
- The meter is primarily a Free Spins feature — it accumulates across all spins in a bonus session

---

### 3. `auroraExplode`

**When:** Immediately after `auroraMeterUpdate`, when aurora cells are consumed by winning clusters.

```json
{
  "type": "auroraExplode",
  "index": 16,
  "positions": [
    {"reel": 3, "row": 4}
  ]
}
```

**Fields:**
- `positions` — Array of `{reel, row}` positions where aurora cells are exploding

**Web SDK action:**
- Play explosion/activation animation on the aurora cell overlays at these positions
- Remove the aurora overlay from these cells (they are consumed — single use per spin)
- These are the aurora cells that were hit by the winning cluster
- This event signals that wilds WILL be generated (the actual placement comes later via `auroraWildPlace`)

---

### 4. `auroraWildPlace`

**When:** After a `tumbleBoard` event (symbols removed and dropped), when aurora-generated wilds are placed on the board.

```json
{
  "type": "auroraWildPlace",
  "index": 18,
  "position": {"reel": 3, "row": 4},
  "meterBefore": 0,
  "meterAfter": 0
}
```

**Fields:**
- `position` — Single `{reel, row}` where a wild symbol is being placed
- `meterBefore` — Wild meter value before this placement
- `meterAfter` — Wild meter value after this placement

**Web SDK action:**
- Animate a wild symbol appearing/landing at `position`
- Replace the existing symbol at that position with a Wild (`W`) symbol
- Multiple `auroraWildPlace` events can appear in sequence (one per wild placed) — animate them in order or as a batch
- After ALL `auroraWildPlace` events are processed, the tumble loop continues (the engine re-evaluates the board for new winning clusters formed by the new wilds)

---

## Complete Event Flow Per Spin

Here is the exact sequence the web SDK should handle for one spin cycle:

```
1. reveal                  → Drop board, show symbols
2. auroraReveal            → Show aurora overlays on marked cells
3. [TUMBLE LOOP START]
   a. updateGrid           → Show current multiplier state
   b. winInfo              → Highlight winning clusters, show win amount
   c. updateGrid           → Show doubled multipliers at win positions
   d. updateTumbleWin      → Update running win counter
   e. auroraMeterUpdate    → (if aurora hit) Update meter UI
   f. auroraExplode        → (if aurora hit) Explode aurora cells
   g. tumbleBoard          → Remove winning symbols, tumble down, refill
   h. auroraWildPlace ×N   → (if aurora activated) Place wild(s) on board
   [LOOP BACK TO 3a if new wins exist]
4. setWin                  → Show spin win total
5. setTotalWin             → Update session running total
```

### Free Spin Flow (wraps the above):

```
freeSpinTrigger            → Trigger animation, show total free spins awarded
  updateFreeSpin           → Show spin counter (e.g., "Spin 1/8")
  [SPIN CYCLE as above]
  updateFreeSpin           → "Spin 2/8"
  [SPIN CYCLE as above]
  ...
freeSpinEnd                → Show bonus summary, totalWilds collected
finalWin                   → Show final win amount
```

### End-of-Bonus Wild Release

At the end of a free spins session, accumulated wild meter wilds can be released all at once. This appears as:

```
reveal (gameType=freegame)       → New board for wild release phase
auroraWildPlace ×N               → Many wilds placed at once (can be 10+ events)
[TUMBLE LOOP]                    → Evaluate massive wins from all the wilds
setWin / setTotalWin
```

In the reference book, this is events 158–178: a reveal followed by 13 `auroraWildPlace` events dumping wilds across the board, resulting in a 254,800-cent (2548×) single-spin win.

---

## Event Type Summary Table

| Event Type | Frequency in Reference | Singular/Plural Position | Key Animation |
|---|---|---|---|
| `auroraReveal` | 9 (once per spin) | `positions[]` (array) | Show glowing overlays |
| `auroraMeterUpdate` | 8 | N/A (meter data) | Update meter UI |
| `auroraExplode` | 8 | `positions[]` (array) | Explode/consume overlays |
| `auroraWildPlace` | 33 | `position` (single) | Wild symbol landing |

---

## Key Implementation Notes

1. **Aurora overlays are behind symbols** — render as a background glow/effect, not as a separate symbol
2. **Single-use per spin** — once an aurora cell activates (explodes), it's gone for that spin; new ones are dealt next spin via the next `auroraReveal`
3. **Wilds placed after tumble** — `auroraWildPlace` happens AFTER `tumbleBoard` (symbols already dropped); the wild replaces whatever landed there
4. **Wild placement continues tumble loop** — after wilds are placed, the engine checks for new wins; if the new wilds form clusters, the tumble loop continues
5. **Position coordinates** — `reel` is 0-based (0–6), `row` includes padding so active rows are 1–7
6. **All amounts are in cents** — divide by 100 for display currency. A `payoutMultiplier` of 289480 = 2894.80×
7. **`aurora` field on symbols** — only present in `reveal` board when true; absent (not false) when there's no aurora
8. **Meter values** — `meterBefore`/`meterAfter` on `auroraWildPlace` and `meterTotal` on `auroraMeterUpdate` track cumulative aurora activity; currently all 0 in this reference book (meter logic is placeholder-ready)
