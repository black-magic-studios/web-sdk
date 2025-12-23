<script lang="ts">
  import { Sprite, Container } from 'pixi-svelte';
  import * as PIXI from 'pixi.js';

  // 1. Accept the exact props coming from Symbol.svelte
  export let symbolInfo: any; // Contains texture, size, etc.
  export let x: number = 0;
  export let y: number = 0;
  export let density: number = 1; // Passed down from Symbol.svelte

  // 2. Extract texture and size reactively
  $: texture = symbolInfo?.texture || PIXI.Texture.EMPTY;
  $: size = symbolInfo?.size || 100;

  // 3. Recalculate grid whenever density or size changes
  $: grid = getGrid(density, size);

  function getGrid(d: number, s: number) {
    let cells = [];
    
    // Level 1: Standard (1 big image)
    if (d <= 1) {
      // If standard, just center it (assuming anchor 0.5 logic usually)
      // But since we are using a Container, let's keep it simple: 0,0 relative to container
      cells.push({ x: 0, y: 0, size: s });
      return cells;
    }

    // Level 2: 2x2 Split (4 images)
    if (d === 4) {
      const subSize = (s / 2) - 2; 
      const gap = 4;
      // Offset to center the group inside the container
      const startX = -s/2 + subSize/2 + 1; // Adjusting for anchor 0.5 centering
      const startY = -s/2 + subSize/2 + 1;

      // Actually, easier way: Draw from Top-Left (0,0) and handle Anchor in the Sprite
      cells = [
        { x: -s/4 - 1, y: -s/4 - 1, size: subSize }, // Top-Left
        { x: s/4 + 1,  y: -s/4 - 1, size: subSize }, // Top-Right
        { x: -s/4 - 1, y: s/4 + 1,  size: subSize }, // Bot-Left
        { x: s/4 + 1,  y: s/4 + 1,  size: subSize }  // Bot-Right
      ];
      return cells;
    }

    // Level 3: 4x4 Shatter (16 images)
    if (d >= 16) {
      const subSize = (s / 4) - 1; 
      const gap = 1.33;
      const offset = (s / 2) - (subSize / 2); // Center the grid

      for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
          cells.push({
            // Calculate position relative to center (0,0)
            x: (col * (subSize + gap)) - offset,
            y: (row * (subSize + gap)) - offset,
            size: subSize
          });
        }
      }
      return cells;
    }
    
    return [{ x: 0, y: 0, size: s }];
  }
</script>

<Container {x} {y}>
  {#each grid as cell}
    <Sprite 
      {texture} 
      width={cell.size} 
      height={cell.size} 
      x={cell.x} 
      y={cell.y} 
      anchor={0.5} 
    />
  {/each}
</Container>