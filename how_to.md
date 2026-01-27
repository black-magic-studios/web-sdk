# StakeEngine Web SDK Slot Game How‑To

This guide explains how the sample slot games in this repo are structured and how to build a new game using the same SDK patterns. All examples are taken from the three allowed sample games:

- [apps/lines](apps/lines)
- [apps/ways](apps/ways)
- [apps/scatter](apps/scatter)

If a detail is unclear in those samples, it is explicitly called out as **Unknown from current code inspection** with a list of files that would confirm it.

---

## 1) High‑level mental model

### Game loop lifecycle (what happens on a spin)

1. **Player input → state machine event**
   - UI emits events like `bet`, `autoBet`, or `resumeBet` and a game actor forwards them to the state machine.
   - See: [apps/lines/src/components/EnableGameActor.svelte](apps/lines/src/components/EnableGameActor.svelte)

2. **State machine prepares the board**
   - On a new game start, the actor triggers a pre‑spin to set up the board and visuals.
   - See: [apps/lines/src/game/actor.ts](apps/lines/src/game/actor.ts)

3. **Math results arrive as “book events”**
   - The game does not directly render the backend response; it **replays a sequence of book events** that drive the presentation.
   - `playBookEvents()` iterates events and dispatches handlers in `bookEventHandlerMap`.
   - See: [apps/lines/src/game/utils.ts](apps/lines/src/game/utils.ts), [apps/lines/src/game/bookEventHandlerMap.ts](apps/lines/src/game/bookEventHandlerMap.ts)

4. **Book events → UI + animation**
   - Reveal events spin/settle reels.
   - Win events animate symbols and update win UI.
   - Feature events (free spins, multipliers, tumbles) toggle UI panels and animated overlays.

### State machine model (base → feature → return)

- Each game uses a `gameActor` created from `utils-xstate` helpers. It drives the play loop and handles resume logic.
- Base vs. bonus game types are reflected in `gameType` (e.g., `basegame`, `freegame`, `freeSpins`) and are switched inside book event handlers.
- See:
  - [apps/lines/src/game/actor.ts](apps/lines/src/game/actor.ts)
  - [apps/lines/src/game/stateGame.svelte.ts](apps/lines/src/game/stateGame.svelte.ts)
  - [apps/scatter/src/game/bookEventHandlerMap.ts](apps/scatter/src/game/bookEventHandlerMap.ts)

### Math results drive the UI

- The “math output” is represented as a `Bet` with a list of `BookEvent`s (e.g., `reveal`, `winInfo`, `freeSpinTrigger`).
- Each `BookEvent` handler updates the board and/or UI through the event emitter.
- Examples of event types:
  - Lines/ways: `winInfo` includes line/ways positions and metadata. See [apps/lines/src/game/typesBookEvent.ts](apps/lines/src/game/typesBookEvent.ts)
  - Scatter: cluster/tumble‑style events like `tumbleBoard` and `updateTumbleWin`. See [apps/scatter/src/game/typesBookEvent.ts](apps/scatter/src/game/typesBookEvent.ts)

### Win evaluation → animation/presentation

- Wins are animated by broadcasting `boardWithAnimateSymbols`, then UI layers count up the win amount.
- A “big win” overlays and sounds are handled through `winLevelMap` and `Win.svelte`.
- See:
  - [apps/lines/src/components/Board.svelte](apps/lines/src/components/Board.svelte)
  - [apps/lines/src/components/Win.svelte](apps/lines/src/components/Win.svelte)
  - [apps/lines/src/game/bookEventHandlerMap.ts](apps/lines/src/game/bookEventHandlerMap.ts)

---

## 2) Project structure (where things live)

**Top‑level**
- apps/: Each game is a standalone Svelte app (lines, ways, scatter, etc.).
- packages/: Shared SDK utilities and UI components.
- documentation/: Repo documentation and images used by README.

**Per‑game structure** (example: [apps/lines](apps/lines))
- src/game/: Game logic, state, and configuration
  - `config.ts`: math configuration and paytables
  - `constants.ts`: sizes, symbol mapping, and spin options
  - `stateGame.svelte.ts`: board setup and derived data
  - `bookEventHandlerMap.ts`: presentation flow for each book event
  - `eventEmitter.ts`: game‑level event bus
- src/components/: Visual composition (board, symbols, win UI, free spins)
- src/routes/: Svelte routes (`+page.svelte` is empty in samples; UI is in components)
- static/: Game assets (`static/assets/` is referenced by the loader)

See the live wiring in [apps/lines/src/components/Game.svelte](apps/lines/src/components/Game.svelte).

---

## 3) Core SDK building blocks (with concrete examples)

### Scene / stage setup

- The game scene is built in a `pixi-svelte` `<App>` with layered components.
- UI and layout components are mounted with `MainContainer`, `UI`, and HTML overlays.
- Example composition: [apps/lines/src/components/Game.svelte](apps/lines/src/components/Game.svelte)

### Board / reels setup

- The board is created by `createReelForSpinning` (lines) or `createReelForCascading` (ways/scatter).
- Reels use `SYMBOL_SIZE`, `INITIAL_BOARD`, and dynamic spin options.
- Example:
  - Lines: [apps/lines/src/game/stateGame.svelte.ts](apps/lines/src/game/stateGame.svelte.ts)
  - Ways: [apps/ways/src/game/stateGame.svelte.ts](apps/ways/src/game/stateGame.svelte.ts)
  - Scatter: [apps/scatter/src/game/stateGame.svelte.ts](apps/scatter/src/game/stateGame.svelte.ts)

### Symbol system (IDs, mapping, paytable linkage, textures)

- `config.ts` defines paytable values and symbol metadata (scatter, wild, multiplier).
- `constants.ts` maps a symbol name to render assets by state (`static`, `win`, `explosion`).
- `assets.ts` maps asset keys to sprite/spine files.
- Example files:
  - [apps/lines/src/game/config.ts](apps/lines/src/game/config.ts)
  - [apps/lines/src/game/constants.ts](apps/lines/src/game/constants.ts)
  - [apps/lines/src/game/assets.ts](apps/lines/src/game/assets.ts)

### Spin / result pipeline (request → response → render)

- `playBookEvents()` iterates the math output (a `Bet`), then each book event handler updates the board/UI.
- The “request → response” part is not visible inside the sample apps.

**Unknown from current code inspection**: How the SDK performs the actual network request for a spin and maps it into `Bet` data.
- Likely confirmation files: packages/utils-xstate, packages/rgs-requests, packages/state-shared

### Win types

- **Lines**: `paylines` are defined and `winInfo` includes `lineIndex` in metadata.
  - [apps/lines/src/game/config.ts](apps/lines/src/game/config.ts)
  - [apps/lines/src/game/typesBookEvent.ts](apps/lines/src/game/typesBookEvent.ts)
- **Ways**: no paylines in config; `winInfo` uses positions directly (ways‑style).
  - [apps/ways/src/game/config.ts](apps/ways/src/game/config.ts)
  - [apps/ways/src/game/typesBookEvent.ts](apps/ways/src/game/typesBookEvent.ts)
- **Scatter / cluster‑like**: `winInfo` includes overlay positions and `tumbleBoard` events.
  - [apps/scatter/src/game/typesBookEvent.ts](apps/scatter/src/game/typesBookEvent.ts)
  - [apps/scatter/src/game/bookEventHandlerMap.ts](apps/scatter/src/game/bookEventHandlerMap.ts)

### Feature triggers (scatter counts, wild logic, multipliers)

- Scatter landing increments a counter during reel stop, used for anticipation and audio.
- Multipliers are represented on raw symbols (e.g., `M` with `multiplier` in scatter).
- Examples:
  - Scatter counter and sounds: [apps/lines/src/game/stateGame.svelte.ts](apps/lines/src/game/stateGame.svelte.ts), [apps/lines/src/components/Sound.svelte](apps/lines/src/components/Sound.svelte)
  - Multiplier board animation: [apps/scatter/src/components/MultiplierBoard.svelte](apps/scatter/src/components/MultiplierBoard.svelte)

### Animations (trigger, sequence, interrupt)

- Symbols transition through `symbolState` and resolve `oncomplete` callbacks.
- Book events can sequence animations (e.g., `winInfo` → `boardWithAnimateSymbols`).
- Example:
  - Symbol state changes: [apps/lines/src/components/Board.svelte](apps/lines/src/components/Board.svelte)
  - Win animation flow: [apps/lines/src/components/Win.svelte](apps/lines/src/components/Win.svelte)

### Audio system integration

- Sound events are handled via the event bus and routed to `sound.players`.
- Example: [apps/lines/src/components/Sound.svelte](apps/lines/src/components/Sound.svelte)

### UI composition (buttons, HUD meters, win display)

- Core game UI is a mix of Pixi layers (`components-ui-pixi`) and HTML overlays (`components-ui-html`).
- Win display uses `WinCountUpProvider` and `ResponsiveBitmapText`.
- Example: [apps/lines/src/components/Game.svelte](apps/lines/src/components/Game.svelte), [apps/lines/src/components/Win.svelte](apps/lines/src/components/Win.svelte)

### Responsive scaling and layout

- Layout uses `createLayout` with size maps and background ratios.
- Board positioning uses `stateLayoutDerived` for centering and scale.
- Example: [apps/lines/src/game/stateLayout.ts](apps/lines/src/game/stateLayout.ts)

### Event bus / messaging

- `eventEmitter` is created per game and carries UI/game events.
- Game components subscribe to events in `subscribeOnMount`.
- Example: [apps/lines/src/game/eventEmitter.ts](apps/lines/src/game/eventEmitter.ts)

### Configuration patterns and constants

- `config.ts`: math configuration, paylines, symbols, bet modes.
- `constants.ts`: rendering constants and symbol mapping.
- Example: [apps/lines/src/game/config.ts](apps/lines/src/game/config.ts), [apps/lines/src/game/constants.ts](apps/lines/src/game/constants.ts)

---

## 4) “How to build a new slot game” checklist

1. **Scaffold a new app**
   - Copy one of the sample apps (lines/ways/scatter) as a starting point.
   - Update package name, game name, and IDs in your new app’s `package.json` and `config.ts`.

2. **Create symbol art + sprite sheets**
   - Add spine/sprite assets under static/assets in your new app.
   - Register them in `assets.ts` and map them in `constants.ts`.

3. **Set up reels/board**
   - Define `INITIAL_BOARD`, `SYMBOL_SIZE`, and `BOARD_DIMENSIONS` in `constants.ts`.
   - Create reels in `stateGame.svelte.ts` using `createReelForSpinning` or `createReelForCascading`.

4. **Wire math output to visuals**
   - Define your book event types in `typesBookEvent.ts`.
   - Implement handlers in `bookEventHandlerMap.ts`.

5. **Implement win presentation**
   - Use `boardWithAnimateSymbols` for symbol animations.
   - Update win UI via `winUpdate` events.

6. **Add features (free spins, multipliers, tumbles)**
   - Implement feature book events (`freeSpinTrigger`, `updateGlobalMult`, `tumbleBoard`, etc.).
   - Add UI components for feature overlays (see scatter’s multiplier/tumble components).

7. **Testing and debugging**
   - Use storybook scripts in each app’s `package.json`.
   - Validate book event sequences and ensure `playBookEvents` completes.

---

## 5) Common mistakes and how to debug

- **Asset loading issues**
  - Symptom: missing textures or blank symbols.
  - Check `assets.ts` entries and that static assets exist.
  - Files: [apps/lines/src/game/assets.ts](apps/lines/src/game/assets.ts), [apps/lines/static/assets](apps/lines/static/assets)

- **Missing symbol IDs**
  - Symptom: undefined symbol rendering or crashes.
  - Ensure `config.symbols`, `SYMBOL_INFO_MAP`, and `assets` are consistent.

- **Incorrect layout scaling**
  - Symptom: board off‑center or clipped.
  - Check `stateLayout.ts` ratios and `boardLayout()` calculations.

- **Animation sequencing problems**
  - Symptom: win animations interrupt or never resolve.
  - Ensure `oncomplete` resolves in symbol components and `boardWithAnimateSymbols` awaits them.

- **State machine issues**
  - Symptom: spins never start or resume flow stuck.
  - Check `EnableGameActor.svelte` and `actor.ts` pre‑spin logic.

- **Mismatch between math and UI**
  - Symptom: positions don’t match winning symbols.
  - Validate the `BookEvent` payload positions and board dimensions.

---

## 6) Comparison table (lines vs ways vs scatter)

| Game | Payout logic type | Win presentation style | Board layout | Notable patterns |
| --- | --- | --- | --- | --- |
| Lines | Paylines with `lineIndex` metadata | Sequential line symbol animation + win count‑up | 5 reels × 3 rows (padded to 5 in `INITIAL_BOARD`) | Payline definitions in config and `winInfo` metadata |
| Ways | Ways‑style (no paylines in config) | Sequential position animation | 5 reels × 3 rows (padded) | Cascading reel setup (`createReelForCascading`) |
| Scatter | Cluster/tumble with global multipliers | Tumble board, cluster win amounts, multiplier overlays | 6 reels × 5 rows (padded to 7 in `INITIAL_BOARD`) | `tumbleBoard` and `boardMultiplierInfo` event flow |

Sources:
- [apps/lines/src/game/config.ts](apps/lines/src/game/config.ts)
- [apps/ways/src/game/config.ts](apps/ways/src/game/config.ts)
- [apps/scatter/src/game/typesBookEvent.ts](apps/scatter/src/game/typesBookEvent.ts)

---

## 7) Practical code snippets (minimal, from samples)

### Symbol mapping

```ts
// From apps/lines/src/game/constants.ts
export const SYMBOL_INFO_MAP = {
  H1: {
    win: { type: 'spine', assetKey: 'H1', animationName: 'h1' },
    static: { type: 'sprite', assetKey: 'h1.webp' },
    // ...
  },
};
```

### Initialize board / reels

```ts
// From apps/lines/src/game/stateGame.svelte.ts
const board = _.range(BOARD_DIMENSIONS.x).map((reelIndex) =>
  createReelForSpinning({
    reelIndex,
    symbolHeight: SYMBOL_SIZE,
    initialSymbols: INITIAL_BOARD[reelIndex],
    initialSymbolState: INITIAL_SYMBOL_STATE,
  })
);
```

### Handle a spin result

```ts
// From apps/lines/src/game/bookEventHandlerMap.ts
reveal: async (bookEvent) => {
  stateGame.gameType = bookEvent.gameType;
  await stateGameDerived.enhancedBoard.spin({
    revealEvent: bookEvent,
    paddingBoard: config.paddingReels[bookEvent.gameType],
  });
},
```

### Trigger a win animation

```ts
// From apps/lines/src/components/Board.svelte
boardWithAnimateSymbols: async ({ symbolPositions }) => {
  const promises = symbolPositions.map(async (position) => {
    const reelSymbol = context.stateGame.board[position.reel].reelState.symbols[position.row];
    reelSymbol.symbolState = 'win';
    await waitForResolve((resolve) => (reelSymbol.oncomplete = resolve));
    reelSymbol.symbolState = 'postWinStatic';
  });
  await Promise.all(promises);
},
```

### Feature entry / exit (free spins)

```ts
// From apps/lines/src/game/bookEventHandlerMap.ts
freeSpinTrigger: async (bookEvent) => {
  await eventEmitter.broadcastAsync({ type: 'transition' });
  stateGame.gameType = 'freegame';
  eventEmitter.broadcast({ type: 'freeSpinCounterShow' });
  eventEmitter.broadcast({ type: 'freeSpinCounterUpdate', total: bookEvent.totalFs });
},

freeSpinEnd: async () => {
  stateGame.gameType = 'basegame';
  eventEmitter.broadcast({ type: 'freeSpinCounterHide' });
},
```

---

## 8) Terminology glossary

- **Spin**: One play cycle where the board animates and settles, driven by a `Bet`’s book events.
- **Stop positions**: The final positions of symbols after reels settle. In samples, provided in the `reveal` event’s `board`.
- **Paylines**: Fixed line patterns for evaluating wins (lines game defines in config).
- **Ways**: Win evaluation without paylines; counts matching symbols across reels.
- **Scatter**: Symbol that triggers features regardless of line adjacency.
- **Wild**: Substitute symbol defined in config (`special_properties: ['wild']`).
- **Feature / bonus**: A non‑basegame mode like free spins, triggered via `freeSpinTrigger` events.
- **RTP**: Return to Player, defined in config; conceptually the long‑term payout ratio.
- **Win presentation**: Visual/audio sequence showing wins, counts, and effects.
- **Big win**: A tiered win level with bigger animations and sounds (`winLevelMap`).
- **Anticipation**: Visual/audio cues when a feature may trigger; signaled by anticipation data in `reveal` events.
- **Tumble / cascade**: A mechanic where winning symbols explode and new ones fall (scatter game).

---

## Notes on unknowns

- **Network API and bet response mapping**: Unknown from current code inspection.
  - Confirm in: packages/utils-xstate, packages/rgs-requests, packages/state-shared

- **Exact math engine output schema** beyond the book event shapes in each sample: Unknown from current code inspection.
  - Confirm in: packages/rgs-requests and any game‑specific backend specs
