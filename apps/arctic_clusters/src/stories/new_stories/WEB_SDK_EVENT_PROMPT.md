# Arctic Clusters — Web SDK Event Integration Guide

## Game Overview

**Arctic Clusters** is a 7×7 cluster-pays tumble slot. Minimum cluster size is 5 matching symbols. Winning clusters explode, symbols gravity-drop, new symbols fill from the top. Tumbles repeat until no more wins form.

- **Grid**: 7 reels × 7 active rows (rows 1-7), plus padding rows 0 and 8 (top/bottom, decorative)
- **Symbols**: H1, H2, H3, H4 (high), L1, L2, L3, L4 (low), W (wild), SC (scatter)
- **Wild**: Substitutes for all symbols except SC
- **Win Cap**: 25,000× bet
- **RTP**: 96.5%

### Bet Modes
| Mode | Cost Multiplier | Description |
|------|----------------|-------------|
| `base` | 1.0× | Standard base game |
| `ante` | 2.5× | Ante bet (higher scatter frequency) |
| `bonus` | 100× | Buy Bonus (skips base, starts free spins directly) |
| `M2X`–`M1024X` | 3×–1107× | Multiplier bet modes (guaranteed global multiplier during bonus) |

---

## Storybook Data Format

Each simulation result is a **book** object:

```typescript
interface Book {
  baseGameWins: number;     // Base game total win (in cents)
  freeGameWins: number;     // Free game total win (in cents)
  criteria: string;         // Bet mode: "0" (base), "freegame" (bonus), "antegame", "M2X"..."M1024X"
  events: Event[];          // Ordered array of game events
  id: number;               // Book index
  payoutMultiplier: number; // Total payout as multiplier of bet
  _label?: string;          // (curated files only) Human label for the scenario
}
```

The curated storybook `.ts` files are `export default [Book, Book, ...]`.

---

## Complete Event Type Reference

There are **21 event types**. Every event has `index` (sequential) and `type` (string). Events MUST be processed in order.

---

### 1. `reveal` — New Board Drawn

Fired at the start of each spin (base or free). This is the primary board state.

```json
{
  "type": "reveal",
  "index": 0,
  "gameType": "basegame" | "freegame",
  "anticipation": [0, 0, 0, 0, 0, 0, 0],
  "paddingPositions": [243, 109, 38, 197, 61, 147, 82],
  "board": [
    [ // Reel 0 — 9 symbols (rows 0-8, active play area is rows 1-7)
      {"name": "L1"},                              // row 0 (top padding)
      {"name": "H2"},                              // row 1 (top active)
      {"name": "H1"},
      {"aurora": true, "name": "L3"},              // aurora overlay on this cell
      {"name": "H3"},
      {"multiplier": 2, "name": "L3"},             // persistent grid multiplier
      {"multiplier": 2, "name": "L2"},
      {"name": "H4"},
      {"name": "L1"}                               // row 8 (bottom padding)
    ],
    // ... 6 more reels
  ]
}
```

**Key symbol properties:**
- `name` (string): Symbol ID — `"H1"`, `"L4"`, `"W"`, `"SC"`, etc.
- `aurora` (boolean, optional): `true` if an aurora cell overlay is on this position
- `multiplier` (number, optional): Grid position multiplier (only in `freegame`). Starts at 1 (omitted when 1), doubles on each win: 2→4→8→16→...→1024. **Persists across all free spins.**

**Notes:**
- `anticipation`: Per-reel flag. `1` = play scatter anticipation animation on this reel.
- `paddingPositions`: Reel strip indices for the padding rows (used for visual continuity).
- `gameType`: `"basegame"` for base/ante/multiplier spins, `"freegame"` for free spins.

---

### 2. `auroraReveal` — Aurora Cell Positions

Fired immediately after `reveal`. Shows where aurora overlay cells are placed this spin.

```json
{
  "type": "auroraReveal",
  "index": 1,
  "positions": [
    {"reel": 1, "row": 5},
    {"reel": 2, "row": 3},
    {"reel": 4, "row": 7}
  ]
}
```

These positions correspond to symbols in the `reveal` board that have `"aurora": true`.

---

### 3. `updateGrid` — Grid Multiplier State

Emitted when there are wins. Shows the full 7×7 grid multiplier state.

```json
{
  "type": "updateGrid",
  "index": 4,
  "gridMultipliers": [
    [1, 1, 1, 1, 2, 2, 1],  // Reel 0, rows 1-7
    [1, 1, 1, 1, 1, 1, 2],  // Reel 1
    // ... 5 more reels
  ]
}
```

**Behavior:**
- Fired **twice** per tumble when there's a win: once BEFORE the win (current state), once AFTER (with doubled winning positions).
- Values: 1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024 (max).
- **Base game**: Resets to all 1s each spin.
- **Free spins**: Persists the **entire bonus session** — multipliers accumulate across all spins and tumbles.

---

### 4. `winInfo` — Cluster Win Details

Fired when winning clusters are found on the current board.

```json
{
  "type": "winInfo",
  "index": 5,
  "totalWin": 20,
  "wins": [
    {
      "symbol": "L2",
      "clusterSize": 5,
      "win": 20,
      "positions": [
        {"reel": 2, "row": 2},
        {"reel": 3, "row": 2},
        {"reel": 4, "row": 2},
        {"reel": 3, "row": 3},
        {"reel": 4, "row": 3}
      ],
      "meta": {
        "overlay": {"reel": 2, "row": 2},
        "clusterMult": 1,
        "globalMult": 1,
        "winWithoutMult": 20
      }
    }
  ]
}
```

**Win calculation**: `win = paytable[symbol][clusterSize] × sum(position_multipliers) × globalMult`

- `overlay`: Position used as the display anchor for the win.
- `clusterMult`: Sum of all grid multipliers across the cluster's positions.
- `globalMult`: Global multiplier (1 for base/ante/bonus, 2-1024 for M2X-M1024X modes).
- `winWithoutMult`: Base paytable value before multipliers.

---

### 5. `updateTumbleWin` — Running Tumble Win

Cumulative win amount for the current tumble sequence (within one spin).

```json
{
  "type": "updateTumbleWin",
  "index": 7,
  "amount": 140
}
```

---

### 6. `auroraMeterUpdate` — Aurora Cell Activated

A winning cluster landed on an aurora cell position. The cell is "collected" and wilds will be generated.

```json
{
  "type": "auroraMeterUpdate",
  "index": 6,
  "cellsCollected": 1,
  "meterTotal": 1
}
```

- `cellsCollected`: Number of aurora cells hit this tumble.
- `meterTotal`: Running total of aurora cells collected this spin.

---

### 7. `auroraExplode` — Aurora Cells Removed

The activated aurora cell positions are visually "exploded" (removed from the aurora overlay).

```json
{
  "type": "auroraExplode",
  "index": 7,
  "positions": [
    {"reel": 5, "row": 5}
  ]
}
```

---

### 8. `tumbleBoard` — Symbols Explode & New Symbols Drop

Winning symbols are removed and new symbols drop from above.

```json
{
  "type": "tumbleBoard",
  "index": 8,
  "explodingSymbols": [
    {"reel": 2, "row": 2},
    {"reel": 3, "row": 2},
    {"reel": 4, "row": 2},
    {"reel": 3, "row": 3},
    {"reel": 4, "row": 3}
  ],
  "newSymbols": [
    [],           // Reel 0: no new symbols
    [],           // Reel 1: no new symbols
    [{"name": "L2"}],              // Reel 2: 1 new symbol drops in
    [{"name": "L2"}, {"name": "L2"}],  // Reel 3: 2 new symbols
    [{"name": "L2"}, {"name": "L2"}],  // Reel 4: 2 new symbols
    [],
    []
  ]
}
```

**Processing:**
1. Remove all `explodingSymbols` from the board (play explosion animation).
2. Remaining symbols gravity-drop downward.
3. `newSymbols[reel]` are the new symbols that fill from the top, in order (top to bottom).

---

### 9. `auroraWildPlace` — Wild Placed on Board

An aurora-generated wild is placed on the board. Fires once per wild placed.

```json
{
  "type": "auroraWildPlace",
  "index": 14,
  "position": {"reel": 4, "row": 3},
  "isRelease": false,
  "meterAfter": 0,
  "meterBefore": 0
}
```

- `position`: Where the wild was placed (replaces the existing symbol).
- `isRelease`: `true` when this wild is placed during the end-of-bonus wild meter release.
- `meterBefore`/`meterAfter`: Wild meter bank values before/after this placement.

**When wilds are placed**: After a tumble sequence exhausts (no more wins), if aurora cells were activated during that sequence, their generated wilds are placed. Then the tumble cycle **restarts** to evaluate potential new wins.

---

### 10. `wildMeterUpdate` — Wild Meter Bank Updated

Fired after a tumble sequence when aurora-placed wilds participated in winning clusters.

```json
{
  "type": "wildMeterUpdate",
  "index": 54,
  "delta": 2,
  "meterBefore": 0,
  "meterAfter": 2,
  "consumedPositions": [
    {"reel": 5, "row": 5},
    {"reel": 5, "row": 6}
  ]
}
```

- `delta`: Number of wilds that were part of winning clusters.
- `consumedPositions`: The exact board positions of the aurora-placed wilds that were consumed by wins. Array length always equals `delta`.
- The wild meter bank accumulates throughout the entire bonus. At the end of all free spins, the banked wilds are released in an extra spin.

**FE should use `consumedPositions` directly** — do not infer which wilds were consumed by cross-referencing `winInfo` positions. The math is the source of truth.

---

### 11. `setWin` — Spin Win Total

Total win for the current spin (all tumbles combined). Only emitted when there were wins.

```json
{
  "type": "setWin",
  "index": 17,
  "amount": 100,
  "winLevel": 0
}
```

`winLevel`: 0 = normal, 1 = big, 2 = mega, 3 = ultra (thresholds for win celebration animations).

---

### 12. `setTotalWin` — Running Bet-Round Total

Cumulative total across base game + all free spins.

```json
{
  "type": "setTotalWin",
  "index": 18,
  "amount": 100
}
```

---

### 13. `freeSpinTrigger` — Base Game Triggers Free Spins

3+ scatters on the board after tumbles exhaust.

```json
{
  "type": "freeSpinTrigger",
  "index": 2,
  "totalFs": 8,
  "positions": [
    {"reel": 2, "row": 2},
    {"reel": 4, "row": 6},
    {"reel": 5, "row": 3}
  ]
}
```

| Scatters | Free Spins |
|----------|-----------|
| 3 | 8 |
| 4 | 10 |
| 5 | 12 |
| 6 | 15 |
| 7 | 18 |
| 8 | 20 |

---

### 14. `superBonusTrigger` — Super Bonus Triggered

4+ scatters trigger the super bonus variant (10 free spins, enhanced features).

```json
{
  "type": "superBonusTrigger",
  "index": 2,
  "totalFs": 10,
  "positions": [
    {"reel": 0, "row": 6},
    {"reel": 2, "row": 3},
    {"reel": 5, "row": 7},
    {"reel": 6, "row": 4}
  ]
}
```

---

### 15. `buyBonusTrigger` — Buy Bonus Entry

Player purchased direct entry to free spins (100× bet cost).

```json
{
  "type": "buyBonusTrigger",
  "index": 0,
  "cost": 10000,
  "totalFs": 8
}
```

---

### 16. `updateFreeSpin` — Free Spin Counter

Marks the start of each numbered free spin.

```json
{
  "type": "updateFreeSpin",
  "index": 1,
  "amount": 1,
  "total": 8
}
```

- `amount`: Current spin number (1-indexed).
- `total`: Total free spins awarded (increases on retrigger).

---

### 17. `freeSpinRetrigger` — Additional Free Spins

3+ scatters during free spins awards more spins.

```json
{
  "type": "freeSpinRetrigger",
  "index": 31,
  "totalFs": 5,
  "positions": [
    {"reel": 2, "row": 7},
    {"reel": 4, "row": 1},
    {"reel": 5, "row": 7}
  ]
}
```

| Scatters (during FS) | Extra Spins |
|----------------------|-------------|
| 3 | +5 |
| 4 | +8 |
| 5 | +10 |
| 6 | +12 |
| 7 | +15 |
| 8 | +18 |

---

### 18. `wildRelease` — End-of-Bonus Wild Meter Release

After the last numbered free spin, if the wild meter has accumulated wilds, they are released in an **extra reveal** (the "Aurora Spin").

```json
{
  "type": "wildRelease",
  "index": 88,
  "wildsToPlace": 2
}
```

This is followed by one `auroraWildPlace` event per wild, each with `isRelease: true`. The meter **decrements by exactly 1** per event. Real example from curated base data (20 banked wilds):

```
wildRelease          { wildsToPlace: 20 }
auroraWildPlace      { isRelease: true, meterBefore: 20, meterAfter: 19, position: {reel:3, row:3} }
auroraWildPlace      { isRelease: true, meterBefore: 19, meterAfter: 18, position: {reel:1, row:2} }
auroraWildPlace      { isRelease: true, meterBefore: 18, meterAfter: 17, position: {reel:1, row:5} }
...                  (each one drains meter by exactly 1)
auroraWildPlace      { isRelease: true, meterBefore:  2, meterAfter:  1, position: {reel:3, row:2} }
auroraWildPlace      { isRelease: true, meterBefore:  1, meterAfter:  0, position: {reel:3, row:7} }
```

**FE must animate the meter strictly from each `auroraWildPlace` release event's `meterBefore`/`meterAfter` values.** Do not locally count down or infer timing — the math is the source of truth for meter state. After all wilds are placed, the tumble cycle evaluates wins normally.

---

### 19. `freeSpinEnd` — Bonus Complete

```json
{
  "type": "freeSpinEnd",
  "index": 103,
  "amount": 9900,
  "totalWilds": 2,
  "winLevel": 2
}
```

- `amount`: Total free game win (in cents at base bet).
- `totalWilds`: Total aurora-placed wilds that participated in wins during the bonus.
- `winLevel`: Win celebration tier.

---

### 20. `finalWin` — Final Payout

```json
{
  "type": "finalWin",
  "index": 104,
  "amount": 9900
}
```

---

### 21. `winCapReached` — Win Cap Hit

Fired when running total reaches 25,000× bet. Tumbles stop.

```json
{
  "type": "winCapReached",
  "index": 234,
  "cappedAmount": 2500000
}
```

---

## Event Flow Sequences

### Base Game — No Wins (Dead Spin)
```
reveal → auroraReveal → setTotalWin → finalWin
```

### Base Game — Wins with Tumbles
```
reveal → auroraReveal
  → updateGrid → winInfo → updateGrid → updateTumbleWin
    → [auroraMeterUpdate → auroraExplode]  (if aurora hit)
      → tumbleBoard
        → [auroraWildPlace × N]  (if aurora wilds pending)
          → [repeat from updateGrid if new wins form]
  → setWin → setTotalWin → finalWin
```

### Base Game → Free Spin Trigger
```
reveal → auroraReveal → freeSpinTrigger → setTotalWin
  → [free spin loop below]
  → freeSpinEnd → finalWin
```

### Base Game → Super Bonus Trigger
```
reveal → auroraReveal → superBonusTrigger → setTotalWin
  → [free spin loop below]
  → freeSpinEnd → finalWin
```

### Buy Bonus
```
buyBonusTrigger
  → [free spin loop below]
  → freeSpinEnd → finalWin
```

### Each Free Spin — No Wins
```
updateFreeSpin → reveal → auroraReveal → setTotalWin
```

### Each Free Spin — With Wins
```
updateFreeSpin → reveal → auroraReveal
  → updateGrid → winInfo → updateGrid → updateTumbleWin
    → [auroraMeterUpdate → auroraExplode]  (if aurora hit)
      → tumbleBoard
        → [auroraWildPlace × N]  (if aurora pending)
          → [repeat from updateGrid if new wins]
  → setWin → setTotalWin
  → [wildMeterUpdate]  (if placed wilds were in wins)
```

### Free Spin Retrigger
After `auroraReveal`, if 3+ scatters:
```
→ freeSpinRetrigger → setTotalWin
```
The next `updateFreeSpin` will show updated `total`.

### End-of-Bonus Wild Meter Release
After the last numbered free spin, if wild meter > 0:
```
reveal → wildRelease
  → auroraWildPlace (isRelease: true) × N
    → [updateGrid → winInfo → updateGrid → updateTumbleWin → tumbleBoard]*  (if wins)
  → setWin → setTotalWin
```
Note: This extra reveal has **no `updateFreeSpin` before it** — it's a bonus spin outside the numbered count.

---

## Curated Storybook Files

Located in `curated_storybooks/`:

| File | Books | Categories |
|------|-------|------------|
| `curated_base.ts` | 11 | no_win, small_win, medium_win, large_win, freespin_trigger, super_bonus, aurora_active, wild_release, retrigger, long_tumble_chain, mega_win |
| `curated_bonus.ts` | 9 | no_win, small_win, medium_win, large_win, aurora_active, wild_release, retrigger, long_tumble_chain, mega_win (uses `buyBonusTrigger`) |
| `curated_ante.ts` | 11 | no_win, small_win, medium_win, large_win, freespin_trigger, super_bonus, aurora_active, wild_release, retrigger, long_tumble_chain, mega_win (2.5× cost) |
| `curated_m2x.ts` | 10 | no_win, small_win, medium_win, large_win, freespin_trigger, super_bonus, aurora_active, wild_release, long_tumble_chain, mega_win |
| `curated_m16x.ts` | 9 | no_win, medium_win, large_win, freespin_trigger, super_bonus, aurora_active, wild_release, long_tumble_chain, mega_win |
| `curated_m128x.ts` | 8 | no_win, large_win, freespin_trigger, super_bonus, aurora_active, wild_release, long_tumble_chain, mega_win |
| `curated_m1024x.ts` | 7 | no_win, freespin_trigger, super_bonus, aurora_active, wild_release, long_tumble_chain, mega_win |

Each book has a `_label` field identifying its category. Higher multiplier modes naturally have fewer small-win categories since minimum payouts are larger.

---

## Important Implementation Notes

1. **Board Coordinates**: `reel` = column (0-6), `row` = position (0-8 where 0 and 8 are padding, 1-7 are active).

2. **Grid Multipliers**: The `gridMultipliers` array is 7×7 (reels × active rows). Map `gridMultipliers[reel][i]` to board row `i+1` (active rows 1-7).

3. **Aurora Wilds & Tumble Restart**: When `auroraWildPlace` events fire after a `tumbleBoard`, the tumble cycle restarts. New clusters may form with the placed wilds.

4. **Wild Meter**: Aurora-placed wilds that end up in winning clusters are banked. At end of bonus, banked wilds are released in an extra spin. Track the meter via `wildMeterUpdate` events (which include `consumedPositions` identifying exactly which wilds were consumed) and display via `wildRelease`.

5. **Math is Source of Truth**: The FE must **never infer feature state from board diffs**. Specifically:
   - Use `isRelease` on `auroraWildPlace` to distinguish release wilds from mid-tumble wilds (do not check `meterBefore > 0`).
   - Use `consumedPositions` on `wildMeterUpdate` to know which wilds were consumed (do not cross-reference `winInfo` positions with tracked wild positions).
   - Use `meterBefore`/`meterAfter` on release `auroraWildPlace` events to animate meter countdown (do not locally decrement a counter).

6. **Symbol Flags on Reveal**: Symbols in `reveal.board` can have:
   - `aurora: true` — aurora cell overlay at this position
   - `multiplier: N` — grid multiplier > 1 at this position (only in freegame)
   - These are informational; the authoritative data comes from `auroraReveal` and `updateGrid` events.

7. **Win Amounts**: All amounts are in **cents at base bet** (bet = 100 cents). To get multiplier: `amount / 100`. The `payoutMultiplier` on the book is the final payout as a multiplier of bet.

8. **Anticipation**: The `anticipation` array in `reveal` signals which reels should play scatter-anticipation animations during the reel-stop sequence. `1` = anticipate, `0` = normal.
