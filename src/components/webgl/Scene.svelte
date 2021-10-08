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

<div class="canvas-container">
  <canvas class="webgl__canvas" bind:this={canvasElement} />

  <div class="navigation-container" />
  <div />
</div>

<style type="text/scss">
  .canvas-container {
    position: relative;
    .webgl__canvas {
      position: fixed;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      z-index: 0;
    }
  }
</style>
