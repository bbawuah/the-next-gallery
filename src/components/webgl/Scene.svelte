<script lang="ts">
  import {onMount} from 'svelte';
  import {Scene} from './Scene';

  let canvasElement: HTMLCanvasElement;

  onMount(() => {
    if (canvasElement) {
      new Scene(canvasElement);
    }
  });
</script>

<canvas class="webgl__canvas" bind:this={canvasElement} />

<style>
  .webgl__canvas {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 1;
  }
</style>
