<script lang="ts" module>
  // We keep the types to prevent import errors in other files
  export type EmitterEventMultiplierBoard =
    | { type: 'multiplierBoardShow' }
    | { type: 'multiplierBoardHide' }
    | { type: 'multiplierBoardInit' }
    | { type: 'multiplierBoardReset' }
    | { type: 'multiplierBoardAnimate' }
    | { type: 'multiplierBoardMove' }
    // Add our new event type here so subscribeOnMount accepts it
    | { type: 'boardMultiplierInfo'; winInfo: any } 
    | { type: 'spinStart' };
</script>

<script lang="ts">
  import { Container, Text } from 'pixi-svelte';
  import BoardContainer from './BoardContainer.svelte';
  import { getContext } from '../game/context';
  
  const context = getContext();

  // --- Svelte 5 State ---
  let show = $state(true); 
  // Initialize as empty array
  let multiplierMap = $state<number[][]>([]); 

  // --- CONFIGURATION ---
  const CELL_WIDTH = 140; 
  const CELL_HEIGHT = 140;
  const OFFSET_X = 70; 
  const OFFSET_Y = 70;

  // --- EVENT LISTENERS ---
  // We must use subscribeOnMount instead of .on()
  context.eventEmitter.subscribeOnMount({
    // 1. Standard Visibility Handlers
    multiplierBoardShow: () => (show = true),
    multiplierBoardHide: () => (show = false),
    
    // 2. Reset Logic (Triggered by spinStart OR multiplierBoardReset)
    multiplierBoardReset: () => { multiplierMap = []; },
    spinStart: () => { multiplierMap = []; },

    // 3. THE NEW LOGIC: Listen for Python Data
    boardMultiplierInfo: (data: any) => {
      // Safety Check: Ensure data exists before assigning
      if (data?.winInfo?.multiplierMap) {
        multiplierMap = data.winInfo.multiplierMap;
        // console.log("Grid Updated:", multiplierMap); // Uncomment to debug
      }
    },

    // 4. Empty handlers to prevent crashes from legacy events
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
            <Text
              text={`x${val}`}
              anchor={0.5}
              x={c * CELL_WIDTH + OFFSET_X}
              y={r * CELL_HEIGHT + OFFSET_Y}
              style={{
                fontFamily: 'Arial', 
                fontSize: 60,
                fontWeight: '900',
                fill: 0xFFD700,
                stroke: 0x000000,
                strokeThickness: 6,
                dropShadow: true,
                dropShadowColor: 0x000000,
                dropShadowDistance: 4,
              }}
            />
          {/if}
        {/each}
      {/each}
    </Container>
  </BoardContainer>
{/if}