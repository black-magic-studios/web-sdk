<script lang="ts" module>
  // Define the events this component listens to
  export type EmitterEventMultiplierBoard =
    | { type: 'multiplierBoardShow' }
    | { type: 'multiplierBoardHide' }
    | { type: 'multiplierBoardInit' }
    | { type: 'multiplierBoardReset' }
    | { type: 'multiplierBoardAnimate' }
    // LISTEN TO SERVER DATA: Matches your bookEventHandlerMap
    | { type: 'boardMultiplierInfo'; winInfo: { multiplierMap: number[][] } } 
    | { type: 'spinStart' };
</script>

<script lang="ts">
  import { Container, Text, Graphics } from 'pixi-svelte';
  import BoardContainer from './BoardContainer.svelte';
  import { getContext } from '../game/context';
  
  // Use game utils for perfect alignment (Same as Cluster)
  import { getSymbolX, getSymbolY } from '../game/utils';
  import { SYMBOL_SIZE } from '../game/constants';

  const context = getContext();

  let show = $state(true); 
  // Initialize empty. Structure: [Row][Col] based on your backend data.
  let multiplierMap = $state<number[][]>([]); 

  // --- ALIGNMENT CONFIG ---
  // Center the badge on the symbol (half width)
  const CENTER_OFFSET_X = SYMBOL_SIZE / 2;
  // Nudge vertically if needed (e.g. -15% of size to sit slightly higher)
  const VERTICAL_ADJUST = -(SYMBOL_SIZE * 0.15); 

  const drawBadge = (g: any) => {
    g.clear();
    g.circle(0, 0, SYMBOL_SIZE * 0.45); 
    g.fill({ color: 0x1a469d, alpha: 0.9 });
    g.stroke({ color: 0x4aaeff, width: 3 });
  };

  context.eventEmitter.subscribeOnMount({
    multiplierBoardShow: () => (show = true),
    multiplierBoardHide: () => (show = false),
    
    // Clear on new spin (Matches Cluster 'multiplierGridClear')
    multiplierBoardReset: () => { multiplierMap = []; },
    spinStart: () => { multiplierMap = []; },

    // --- SERVER DRIVEN UPDATE (Matches Cluster 'multiplierGridUpdate') ---
    // Instead of calculating x2 -> x4 locally, we just accept the map from the server.
    boardMultiplierInfo: (event) => {
       if (event.winInfo && event.winInfo.multiplierMap) {
         multiplierMap = event.winInfo.multiplierMap;
       }
    },

    multiplierBoardInit: () => {},
    multiplierBoardAnimate: async () => {},
  });
</script>

{#if show && multiplierMap.length > 0}
  <BoardContainer>
    <Container>
      {#each multiplierMap as rowData, rowIndex}
        {#each rowData as val, colIndex}
          {#if val > 1}
            <Container 
              x={getSymbolX(colIndex) + CENTER_OFFSET_X} 
              y={getSymbolY(rowIndex) + VERTICAL_ADJUST}
            >
              <Graphics draw={drawBadge} />
              <Text
                text={`x${val}`}
                anchor={0.5}
                style={{
                  fontFamily: 'Arial', 
                  fontSize: SYMBOL_SIZE * 0.42,
                  fontWeight: '900',
                  fill: 0xFFFFFF,
                  stroke: { color: 0x000000, width: 6 }, 
                  dropShadow: {
                    color: 0x000000,
                    distance: 3,
                    blur: 2,
                    angle: 45
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