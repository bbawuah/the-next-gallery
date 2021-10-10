<script lang="ts">
  import {onMount} from 'svelte';
  import Keys from '../Navigation/Keys/Keys.svelte';
  import IconWithText from '../Navigation/Generic/IconWithText.svelte';
  import {Scene} from './Scene';
  import {IconType} from '../../utils/icons/types/IconType';
  import NavigationContainer from '../Navigation/NavigationContainer.svelte';
  import {mobileCheck} from '../../utils/mobileCheck';

  const isMobileDevice = mobileCheck();

  let canvasElement: HTMLCanvasElement;
  let scene: Scene;

  onMount(() => {
    if (canvasElement) {
      scene = new Scene(canvasElement);
    }
  });
</script>

<div class="canvas-container">
  <canvas class="webgl__canvas" bind:this={canvasElement} />

  <NavigationContainer>
    <Keys {isMobileDevice} />

    {#if !isMobileDevice}
      <IconWithText icon={IconType.mouse} message={'Use your mouse to look around'} />
      <IconWithText icon={IconType.escape} message={'Press escape to leave the gallery'} />
    {:else}
      <IconWithText icon={IconType.phone} message={'Rotate your device to look around'} />
    {/if}
  </NavigationContainer>
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
  }
</style>
