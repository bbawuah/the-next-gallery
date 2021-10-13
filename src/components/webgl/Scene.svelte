<script lang="ts">
  import {onMount} from 'svelte';
  import Keys from '../Navigation/Keys/Keys.svelte';
  import IconWithText from '../Navigation/Generic/IconWithText.svelte';
  import {Scene} from './Scene';
  import {IconType} from '../../utils/icons/types/IconType';
  import NavigationContainer from '../Navigation/NavigationContainer.svelte';
  import Icon from '../Icon/Icon.svelte';
  import {playerIsInScene, progressRatio, isMobileDevice as mobileDeviceSubscriber} from '../../store/store';

  let isMobileDevice: boolean;

  let canvasElement: HTMLCanvasElement;
  let scene: Scene;

  let progress: number;
  let isPlaying: boolean;

  playerIsInScene.subscribe(value => {
    isPlaying = value;
  });
  progressRatio.subscribe(value => {
    progress = value;
  });

  mobileDeviceSubscriber.subscribe(value => {
    isMobileDevice = value;
  });

  onMount(() => {
    if (canvasElement) {
      scene = new Scene(canvasElement);
    }
  });

  const onTouchStart = (value: boolean) => {
    console.log('touch started');
    if (isMobileDevice) {
      value = true;
      console.log(value);
    }
  };

  const onTouchEnd = (value: boolean) => {
    console.log('touch ended');

    if (isMobileDevice) {
      value = false;
    }
  };
</script>

<div class="canvas-container" ontouchstart={() => console.log('clicked')}>
  <canvas class="webgl__canvas" bind:this={canvasElement} />
  {#if progress === 100 && isPlaying}
    <NavigationContainer>
      <Keys>
        <div class="keys">
          <div
            on:touchstart={() => {
              scene.events.forward = true;
            }}
            on:touchend={() => {
              scene.events.forward = false;
            }}
            class="up"
          >
            <Icon icon={IconType.up} />
          </div>

          <div
            class="bottom"
            on:touchstart={() => {
              scene.events.backward = true;
            }}
            on:touchend={() => {
              scene.events.backward = false;
            }}
          >
            <Icon icon={IconType.bottom} />
          </div>

          <div
            class="left"
            on:touchstart={() => {
              scene.events.left = true;
            }}
            on:touchend={() => {
              scene.events.left = false;
            }}
          >
            <Icon icon={IconType.left} />
          </div>

          <div
            class="right"
            on:touchstart={() => {
              scene.events.right = true;
            }}
            on:touchend={() => {
              scene.events.right = false;
            }}
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
    width: 100%;
    height: 100%;
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
      width: 155px;
      height: 155px;
      margin-bottom: 8px;

      .up {
        position: absolute;
        top: 35%;
        left: 50%;
        width: 45px;
        transform: translate(-50%, 0);
      }

      .bottom {
        position: absolute;
        bottom: 0;
        left: 50%;
        width: 45px;
        transform: translate(-50%, 0);
      }

      .left {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 45px;
      }

      .right {
        position: absolute;
        bottom: 0;
        right: 0;
        width: 45px;
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

  @media screen and (min-width: 870px) {
    .canvas-container {
      .keys {
        width: 100px;
        height: 100px;

        .up,
        .left,
        .right,
        .bottom {
          width: unset;
        }
      }
    }
  }
</style>
