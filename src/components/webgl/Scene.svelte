<script lang="ts">
  import {onMount} from 'svelte';
  import Keys from '../Navigation/Keys/Keys.svelte';
  import IconWithText from '../Navigation/Generic/IconWithText.svelte';
  import {Scene} from './Scene';
  import {IconType} from '../../utils/icons/types/IconType';

  let canvasElement: HTMLCanvasElement;

  onMount(() => {
    if (canvasElement) {
      new Scene(canvasElement);
    }
  });
</script>

<div class="canvas-container">
  <canvas class="webgl__canvas" bind:this={canvasElement} />

  <div class="navigation-container">
    <Keys />
    <IconWithText icon={IconType.mouse} message={'Use your mouse to look around'} />
    <IconWithText icon={IconType.escape} message={'Press escape to leave the gallery'} />
  </div>
  <div />
</div>

<style type="text/scss">
  .canvas-container {
    position: relative;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    .webgl__canvas {
      position: fixed;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      z-index: 1;
    }
    .navigation-container {
      display: grid;
      grid-template-columns: 130px 130px 130px;
      grid-gap: 10px;
      position: absolute;
      bottom: 50px;
      left: 50px;
      z-index: 1;
    }
  }
</style>
