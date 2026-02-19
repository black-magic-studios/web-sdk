# Arctic Clusters — Storybook Event SDK Integration Prompt

## Overview

Arctic Clusters is a **7-column × 9-row cluster-pays** slot with tumble mechanics, aurora wilds, and a wild-release bonus finale. The storybook JSON files contain the complete sequence of events needed to animate one spin (or one bonus round) from start to finish.

**Storybook file**: `example_bonus_storybook.json` (same directory as this file)

Each storybook is a JSON object with:
```json
{
  "id": 5,
  "payoutMultiplier": 11580,
  "events": [ ... ]
}
```

`payoutMultiplier` = total win in units of bet (e.g. 11580 = 115.80× bet).

---

## Event Processing Rules

Process events **sequentially by array index**. Each event has `"type"` and `"index"` (global sequence number). The SDK should switch on `type` and animate accordingly.

### Grid Coordinates

All positions use `{ "reel": col, "row": row }` where:
- `reel` = column index (0–6, left to right)
- `row` = row index (0–8, top to bottom, row 0 = TOP of reel, row 8 = BOTTOM — only visible rows 2–8 in the viewport for a 7-visible-row grid; rows 0–1 are above the viewport for padding)

### Symbol Format

Symbols are `{ "name": "XX" }` with optional `"aurora": true` flag:
- **H1–H4**: High-pay symbols
- **L1–L4**: Low-pay symbols
- **W**: Wild symbol (substitutes for all pay symbols)
- **SC**: Scatter (triggers free spins when 3+ land)
- **SSC**: Super scatter (triggers super bonus when combined with 3+ SC)

---

## Event Types Reference

### 1. `updateFreeSpin`
**When**: Start of each free spin round.
```json
{ "type": "updateFreeSpin", "index": 0, "amount": 1, "total": 8 }
```
- `amount`: Current spin number (1-based)
- `total`: Total spins awarded so far

**SDK action**: Update the free spin counter display (e.g. "Spin 1 of 8").

---

### 2. `reveal`
**When**: New board is revealed (initial spin or each free spin).
```json
{
  "type": "reveal",
  "index": 1,
  "board": [ [col0_symbols...], [col1_symbols...], ... ],
  "paddingPositions": [58, 52, 235, 211, 54, 10, 96],
  "gameType": "freegame",
  "anticipation": [0, 0, 0, 0, 0, 0, 0]
}
```
- `board`: 7 columns, each with 9 symbols (including 2 padding rows above viewport). Symbols are `{ "name": "H1" }` or `{ "name": "L4", "aurora": true }`.
- `paddingPositions`: Reel strip indices for animation offset (one per column).
- `gameType`: One of `"basegame"`, `"freegame"`, `"freegame_wild_release"`, `"ante"`, or `"buyin_bonus"`.
- `anticipation`: Per-reel anticipation flag (0 = none, 1+ = play anticipation animation).

**SDK action**: Animate reel spin → reveal the board. If `gameType === "freegame_wild_release"`, show the wild release intro animation before/during reveal.

---

### 3. `auroraReveal`
**When**: Immediately after `reveal`, shows which cells have the aurora glow.
```json
{
  "type": "auroraReveal",
  "index": 2,
  "positions": [
    { "reel": 1, "row": 3 },
    { "reel": 4, "row": 6 },
    { "reel": 5, "row": 2 }
  ]
}
```
**SDK action**: Highlight the listed cells with aurora particle effect. These are the same cells that have `"aurora": true` in the `reveal` board, but listed explicitly for convenience.

---

### 4. `updateGrid`
**When**: Before each win evaluation (initial and after each tumble). Shows current multiplier grid.
```json
{
  "type": "updateGrid",
  "index": 7,
  "gridMultipliers": [
    [1, 1, 1, 1, 1, 1, 1],
    [2, 2, 1, 1, 1, 1, 1],
    ...
  ]
}
```
- `gridMultipliers`: 7×7 visible-grid multipliers (col-major). Values are 1, 2, 4, 8, 16, etc. Cells where clusters previously won get their multiplier doubled each time.

**SDK action**: Update the multiplier overlay display on the grid. Cells with multiplier > 1 should show their value.

---

### 5. `winInfo`
**When**: A winning cluster is found after a reveal or tumble.
```json
{
  "type": "winInfo",
  "index": 8,
  "totalWin": 2720,
  "wins": [
    {
      "symbol": "H1",
      "clusterSize": 6,
      "win": 1920,
      "positions": [
        { "reel": 1, "row": 3 },
        { "reel": 2, "row": 3 },
        ...
      ],
      "meta": {
        "globalMult": 1,
        "clusterMult": 16,
        "winWithoutMult": 120,
        "overlay": { "reel": 1, "row": 3 }
      }
    }
  ]
}
```
- `totalWin`: Sum of all cluster wins this tumble step.
- `wins[]`: Array of winning clusters:
  - `symbol`: Winning symbol name
  - `clusterSize`: Number of adjacent cells in cluster (min 5 to win)
  - `win`: Final win amount (= `winWithoutMult × clusterMult × globalMult`)
  - `positions`: All cells in the cluster
  - `meta.globalMult`: Global multiplier (for multiplier buy modes)
  - `meta.clusterMult`: Product of all cell multipliers in the cluster
  - `meta.winWithoutMult`: Base paytable win before multipliers
  - `meta.overlay`: Position to show the win amount pop-up

**SDK action**: Highlight winning cluster cells, show cluster win animation at `overlay` position, display win amount. Wild symbols (`"W"`) in positions count toward the cluster but match any symbol.

---

### 6. `updateTumbleWin`
**When**: After `winInfo`, accumulates the running tumble win.
```json
{ "type": "updateTumbleWin", "index": 10, "amount": 100 }
```
- `amount`: Accumulated win for this spin so far (across all tumbles).

**SDK action**: Update the tumble win counter animation.

---

### 7. `tumbleBoard`
**When**: After a win, winning symbols explode and new symbols fall in.
```json
{
  "type": "tumbleBoard",
  "index": 11,
  "newSymbols": [
    [{ "name": "H2" }, { "name": "L1" }],  // col 0: 2 new symbols drop in
    [{ "name": "H2" }, { "name": "L3" }],  // col 1: 2 new symbols
    [{ "name": "L1" }],                     // col 2: 1 new symbol
    [],                                      // col 3: no symbols removed here
    ...
  ],
  "explodingSymbols": [
    { "reel": 0, "row": 1 },
    { "reel": 1, "row": 1 },
    ...
  ]
}
```
- `explodingSymbols`: Positions of cells that won and are being removed.
- `newSymbols`: Per-column, the new symbols dropping in from above (in order, top first). Empty array `[]` for columns with no exploding symbols.

**SDK action**: 
1. Play explosion animation on `explodingSymbols` positions
2. Remaining symbols fall down (gravity)
3. `newSymbols` drop in from above to fill gaps
4. Continue processing — next event will be another `updateGrid` + `winInfo` (if more wins) or `setWin` (if no more wins)

---

### 8. `auroraMeterUpdate`
**When**: Aurora-tagged cells were part of a winning cluster and got collected.
```json
{
  "type": "auroraMeterUpdate",
  "index": 31,
  "cellsCollected": 3,
  "meterTotal": 3
}
```
- `cellsCollected`: Number of aurora cells just collected this tumble
- `meterTotal`: New meter total after collection

**SDK action**: Animate aurora cells flying into the meter, update meter display to `meterTotal`. Every 3 meter points triggers a wild placement.

---

### 9. `auroraExplode`
**When**: Aurora cells that were part of a winning cluster — visual emphasis before collection.
```json
{
  "type": "auroraExplode",
  "index": 32,
  "positions": [
    { "reel": 5, "row": 4 },
    { "reel": 5, "row": 5 },
    { "reel": 5, "row": 2 }
  ]
}
```
**SDK action**: Play special aurora explosion VFX on these cells (distinct from regular win explosions). Then the meter updates.

---

### 10. `auroraWildPlace`
**When**: Meter threshold reached (every 3 aurora cells) → a wild is placed on the board.
```json
{
  "type": "auroraWildPlace",
  "index": 39,
  "position": { "reel": 5, "row": 1 },
  "meterBefore": 3,
  "meterAfter": 0
}
```
- `position`: Where the wild is placed on the visible board.
- `meterBefore`/`meterAfter`: Meter value before and after this placement. The meter decreases by 3 per wild during normal play. During wild release, it counts down from total wilds.

**SDK action**: Animate a wild symbol appearing at `position` (aurora beam / sparkle effect). Update meter display. The board now has a `W` at that position and will be re-evaluated for wins (next events will be `updateGrid` → `winInfo` or continue).

**Context-dependent behavior**:
- During normal free spins: `meterBefore=0, meterAfter=0` (meter resets per placement)
- During wild release: `meterBefore > meterAfter`, counting down (e.g. 4→3→2→1→0)

---

### 11. `wildRelease` ⭐ NEW
**When**: After the last free spin, if the meter has accumulated wilds. Signals the start of the wild release finale.
```json
{
  "type": "wildRelease",
  "index": 87,
  "wildsToPlace": 4
}
```
- `wildsToPlace`: Total number of wilds about to be placed from the accumulated meter.

**SDK action**: 
1. Show "WILD RELEASE" banner or intro animation
2. Prepare for the upcoming sequence of `auroraWildPlace` events (one for each wild)
3. The preceding `reveal` event will have `gameType: "freegame_wild_release"` — a fresh board is spun for this phase
4. After all wilds are placed, tumble evaluation proceeds normally

**Event sequence for wild release**:
```
reveal (gameType="freegame_wild_release")  ← new board spun
wildRelease (wildsToPlace=N)               ← this event
auroraWildPlace × N                        ← N wilds placed one by one
updateGrid → winInfo → tumbleBoard → ...   ← normal tumble cascade
setWin → setTotalWin                       ← final results
freeSpinEnd → finalWin                     ← bonus end
```

---

### 12. `setWin`
**When**: End of all tumbles for one spin — final win for that spin.
```json
{ "type": "setWin", "index": 12, "amount": 100, "winLevel": 0 }
```
- `amount`: Total win for this individual spin (all tumbles combined)
- `winLevel`: Win category (0 = normal, 1 = big win, 2 = mega win, 3 = epic win)

**SDK action**: Play win celebration animation based on `winLevel`. Show `amount` as the spin win.

---

### 13. `setTotalWin`
**When**: After `setWin`, updates the running total across all spins in the bonus.
```json
{ "type": "setTotalWin", "index": 13, "amount": 11580 }
```
**SDK action**: Update the total win display for the entire bonus round.

---

### 14. `freeSpinTrigger`
**When**: 3+ scatter symbols land in base game.
```json
{
  "type": "freeSpinTrigger",
  "index": 50,
  "totalFs": 8,
  "positions": [{ "reel": 1, "row": 3 }, { "reel": 3, "row": 5 }, ...]
}
```
**SDK action**: Highlight scatter positions, play free spin trigger animation, show "X FREE SPINS" banner.

---

### 15. `freeSpinRetrigger`
**When**: 3+ scatters land during free spins — adds more spins.
```json
{ "type": "freeSpinRetrigger", "index": 60, "totalFs": 16, "positions": [...] }
```
**SDK action**: Show retrigger animation, update total free spins display.

---

### 16. `superBonusTrigger`
**When**: 3+ SC + 1+ SSC land — triggers super bonus (8 spins with enhanced features).
```json
{ "type": "superBonusTrigger", "index": 55, "totalFs": 8, "positions": [...] }
```
**SDK action**: Special super bonus trigger animation. Transition to super bonus mode.

---

### 17. `superBonusRetrigger`
**When**: Re-trigger condition met during super bonus.
```json
{ "type": "superBonusRetrigger", "index": 70, "totalFs": 16, "positions": [...] }
```
**SDK action**: Super bonus retrigger celebration animation.

---

### 18. `freeSpinEnd`
**When**: Last spin of the bonus is complete (including wild release if applicable).
```json
{
  "type": "freeSpinEnd",
  "index": 104,
  "amount": 11580,
  "winLevel": 3,
  "totalWilds": 4
}
```
- `amount`: Total bonus win
- `winLevel`: Final win level for the entire bonus
- `totalWilds`: Total wild symbols placed during the bonus (for recap display)

**SDK action**: Show bonus summary screen with total win, win level celebration, and optional stats (total wilds placed, etc.).

---

### 19. `finalWin`
**When**: Very last event — the definitive final win amount.
```json
{ "type": "finalWin", "index": 105, "amount": 11580 }
```
**SDK action**: Display total win with final celebration animation. Credit the player's balance.

---

### 20. `buyBonusTrigger`
**When**: Player purchases a bonus buy-in.
```json
{ "type": "buyBonusTrigger", "index": 0, "cost": 10000, "totalFs": 8 }
```
**SDK action**: Deduct cost, transition to free spin mode.

---

## Complete Event Flow — Bonus Round Example

Here's the flow from the example storybook (Book #4, payout 115.80× bet):

```
SPIN 1/8:  updateFreeSpin → reveal (5 auroras) → auroraReveal → setTotalWin(0)  [no wins]
SPIN 2/8:  updateFreeSpin → reveal → auroraReveal → updateGrid → winInfo(H2×6=100) → updateGrid → updateTumbleWin(100) → tumbleBoard → setWin(100) → setTotalWin(100)
SPIN 3/8:  updateFreeSpin → reveal → auroraReveal → [win 20] → setTotalWin(120)
SPIN 4/8:  updateFreeSpin → reveal (5 auroras) → auroraReveal → [win 160 → tumble → auroraMeterUpdate(3) → auroraExplode → tumble → win 1400 → 4× auroraWildPlace → win 100] → setWin(1660) → setTotalWin(1780)
SPIN 5/8:  updateFreeSpin → reveal → auroraReveal → setTotalWin(1780)  [no wins]
SPIN 6/8:  updateFreeSpin → reveal → auroraReveal → setTotalWin(1780)  [no wins]
SPIN 7/8:  updateFreeSpin → reveal → auroraReveal → [win 840] → setTotalWin(2620)
SPIN 8/8:  updateFreeSpin → reveal (5 auroras) → auroraReveal → [win 600 → auroraMeterUpdate → auroraExplode → tumble → auroraWildPlace → win 120] → setWin(720) → setTotalWin(3340)

WILD RELEASE:
  reveal (gameType="freegame_wild_release", 4 wilds visible on board)
  wildRelease (wildsToPlace=4)
  auroraWildPlace (reel=4,row=6, meter 4→3)
  auroraWildPlace (reel=2,row=5, meter 3→2)
  auroraWildPlace (reel=5,row=6, meter 2→1)
  auroraWildPlace (reel=2,row=3, meter 1→0)
  updateGrid → winInfo (H1×6=1920 + H2×5=800 = 2720) → updateGrid → updateTumbleWin(2720) → tumbleBoard
  winInfo (5520) → updateGrid → updateTumbleWin(8240) → tumbleBoard  [second tumble cascade]
  setWin(8240) → setTotalWin(11580)
  freeSpinEnd(11580, winLevel=3, totalWilds=4)
  finalWin(11580)
```

---

## Notes for Implementation

1. **Wilds ARE on the reels** — The reel strips contain `W` symbols (FR0 has 73, BR0 has 4–8, etc.). Aurora wilds are an *additional* source, not the only source. The board in `reveal` may already contain wilds before any `auroraWildPlace` events.

2. **Multiplier grid is 7×7** — Even though the board is 7×9, the multiplier grid covers only the 7 visible rows (rows 2–8). The `gridMultipliers` array is col-major, 7 values per column.

3. **Wild release board** — During `freegame_wild_release`, a completely fresh board is spun (new random symbols). The 4 wilds from the meter are then placed on random positions on top of this board. The wilds from the reveal board are the *reel-natural* wilds; the `auroraWildPlace` events add more on top.

4. **Tumble cascade** — After every `tumbleBoard`, the engine re-evaluates for wins. If more clusters are found, you'll see another `updateGrid` → `winInfo` → `tumbleBoard` cycle. This continues until no more wins.

5. **Multiplier doubling** — Every cell that was part of a winning cluster gets its multiplier doubled (visible in `updateGrid`). This persists across tumbles within one spin. Multipliers reset between spins.

6. **Win cap** — Maximum payout is 25,000× bet. If reached, the round ends immediately.
