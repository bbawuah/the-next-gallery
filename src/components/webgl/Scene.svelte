<script lang="ts">
  import {onMount, afterUpdate} from 'svelte';
  import Keys from '../Navigation/Keys/Keys.svelte';
  import IconWithText from '../Navigation/Generic/IconWithText.svelte';
  import {Scene} from './Scene';
  import {IconType} from '../../utils/icons/types/IconType';
  import NavigationContainer from '../Navigation/NavigationContainer.svelte';
  import {mobileCheck} from '../../utils/mobileCheck';
  import Icon from '../Icon/Icon.svelte';
  import ProgressMeter from '../ProgressMeter/ProgressMeter.svelte';
  import {progressRatio} from '../../store/store';

  const isMobileDevice = mobileCheck();

  let canvasElement: HTMLCanvasElement;
  let scene: Scene;

  let progress: number;

  progressRatio.subscribe(value => {
    progress = value;
  });

  onMount(() => {
    if (canvasElement) {
      scene = new Scene(canvasElement, isMobileDevice);
    }
  });

  const onTouchStart = (value: boolean) => {
    console.log('clicked');
    if (isMobileDevice) {
      value = true;
    }
  };

  const onTouchEnd = (value: boolean) => {
    if (isMobileDevice) {
      value = false;
    }
  };
</script>

<div class="canvas-container">
  <canvas class="webgl__canvas" bind:this={canvasElement} />
  {#if progress === 100}
    <NavigationContainer>
      <Keys>
        <div class="keys">
          <div
            ontouchstart={() => onTouchStart(scene.events.forward)}
            ontouchend={() => onTouchEnd(scene.events.forward)}
            class="up"
          >
            <Icon icon={IconType.up} />
          </div>

          <div
            class="bottom"
            ontouchstart={() => onTouchStart(scene.events.backward)}
            ontouchend={() => onTouchEnd(scene.events.backward)}
          >
            <Icon icon={IconType.bottom} />
          </div>

          <div
            class="left"
            ontouchstart={() => onTouchStart(scene.events.left)}
            ontouchend={() => onTouchEnd(scene.events.left)}
          >
            <Icon icon={IconType.left} />
          </div>

          <div
            class="right"
            ontouchstart={() => onTouchStart(scene.events.right)}
            ontouchend={() => onTouchEnd(scene.events.left)}
          >
            <Icon icon={IconType.right} />
          </div>
        </div>

        {#if !isMobileDevice}
          <p>Use the arrows to navigate</p>
        {/if}
      </Keys>

      {#if !isMobileDevice}
        <IconWithText icon={IconType.mouse} message={'Use your mouse to look around'} />
        <IconWithText icon={IconType.escape} message={'Press escape to leave the gallery'} />
      {:else}
        <IconWithText icon={IconType.phone} message={'Rotate your device to look around'} />
      {/if}
    </NavigationContainer>
  {/if}
</div>

<style type="text/scss">
  @import '../../styles/styles.scss';
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

    .keys {
      position: relative;
      width: 100px;
      height: 100px;
      margin-bottom: 8px;

      .up {
        position: absolute;
        top: 35%;
        left: 50%;
        transform: translate(-50%, 0);
      }

      .bottom {
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translate(-50%, 0);
      }

      .left {
        position: absolute;
        bottom: 0;
        left: 0;
      }

      .right {
        position: absolute;
        bottom: 0;
        right: 0;
      }
    }

    p {
      font-family: $font-text-light;
      color: #363636;
      margin: 0;
      text-align: center;
      font-size: 12px;
    }
  }
</style>
