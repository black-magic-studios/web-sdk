<script lang="ts">
  export let map: number[][] = []; // This receives the 6x5 grid from the backend

  // Helper to check if we should show a multiplier (only if > 1)
  function shouldShow(val: number) {
    return val > 1;
  }
</script>

<div class="multiplier-grid">
  {#each map as row, r}
    <div class="row">
      {#each row as val, c}
        <div class="cell">
          {#if shouldShow(val)}
            <div class="multiplier-badge">x{val}</div>
          {/if}
        </div>
      {/each}
    </div>
  {/each}
</div>

<style>
  .multiplier-grid {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    pointer-events: none; /* Let clicks pass through to symbols */
    z-index: 10; /* Ensure it sits ON TOP of the symbols */
  }

  .row {
    display: flex;
    flex: 1;
    width: 100%;
  }

  .cell {
    flex: 1;
    display: flex;
    align-items: center; /* Center vertically */
    justify-content: center; /* Center horizontally */
  }

  .multiplier-badge {
    background: rgba(0, 0, 0, 0.8);
    color: #ffcc00; /* Gold text */
    font-weight: bold;
    font-size: 24px;
    padding: 5px 10px;
    border-radius: 8px;
    border: 2px solid #ffffff;
    box-shadow: 0 0 10px rgba(255, 204, 0, 0.5);
    animation: popIn 0.3s ease-out;
  }

  @keyframes popIn {
    0% { transform: scale(0); }
    80% { transform: scale(1.2); }
    100% { transform: scale(1); }
  }
</style>