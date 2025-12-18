<script lang="ts" module>
  export type EmitterEventMultiplierBoard =
    | { type: 'multiplierBoardShow' }
    | { type: 'multiplierBoardHide' }
    | { type: 'multiplierBoardInit' }
    | { type: 'multiplierBoardReset' }
    | { type: 'multiplierBoardAnimate' }
    | { type: 'multiplierBoardMove' }
    | { type: 'boardMultiplierInfo'; winInfo: any } 
    | { type: 'spinStart' };
</script>

<script lang="ts">
  import { Container, Text, Graphics } from 'pixi-svelte';
  import BoardContainer from './BoardContainer.svelte';
  import { getContext } from '../game/context';
  import { onMount } from 'svelte';

  const context = getContext();

  // --- Svelte 5 State ---
  let show = $state(true); 
  let multiplierMap = $state<number[][]>([]); 

  // --- CONFIGURATION ---
  const CELL_WIDTH = 140; 
  const CELL_HEIGHT = 140;
  const OFFSET_X = 70; 
  const OFFSET_Y = 70;

  // --- DRAWING THE BADGE ---
  // We use 'any' type here to avoid importing 'pixi.js' manually
  const drawBadge = (g: any) => {
    g.clear();
    g.circle(0, 0, 45); // Draw circle path
    g.fill({ color: 0x1a469d, alpha: 0.9 }); // Fill Blue
    g.stroke({ color: 0x4aaeff, width: 3 }); // Stroke Light Blue
  };

  // --- EVENT LISTENERS ---
  context.eventEmitter.subscribeOnMount({
    multiplierBoardShow: () => (show = true),
    multiplierBoardHide: () => (show = false),
    multiplierBoardReset: () => { multiplierMap = []; },
    spinStart: () => { multiplierMap = []; },
    boardMultiplierInfo: (data: any) => {
      if (data?.winInfo?.multiplierMap) {
        multiplierMap = data.winInfo.multiplierMap;
      }
    },
    multiplierBoardInit: () => {},
    multiplierBoardAnimate: async () => {},
    multiplierBoardMove: async () => {},
  });
</script>

{#if show && multiplierMap.length > 0}
  <BoardContainer>
    <Container>
      {#each multiplierMap as row, r}
        {#each row as val, c}
          {#if val > 1}
            <Container 
              x={c * CELL_WIDTH + OFFSET_X} 
              y={r * CELL_HEIGHT + OFFSET_Y}
            >
              <Graphics draw={drawBadge} />

              <Text
                text={`x${val}`}
                anchor={0.5}
                x={0}
                y={0}
                style={{
                  fontFamily: 'Arial', 
                  fontSize: 42,
                  fontWeight: '900',
                  fill: 0xFFFFFF,
                  // In Pixi v8, stroke is an object containing width and color
                  stroke: { color: 0x000000, width: 6 }, 
                  dropShadow: {
                    color: 0x000000,
                    distance: 3,
                    blur: 2,
                    angle: 45 // 45 degrees usually works well
                  },
                  align: 'center',
                }}
              />
            </Container>
          {/if}
        {/each}
      {/each}
    </Container>
  </BoardContainer>
{/if}