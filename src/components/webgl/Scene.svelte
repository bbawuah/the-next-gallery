<script lang="ts">
  import {onMount} from 'svelte';
  import Keys from '../Navigation/Keys/Keys.svelte';
  import IconWithText from '../Navigation/Generic/IconWithText.svelte';
  import {Scene} from './Scene';
  import {IconType} from '../../utils/icons/types/IconType';
  import NavigationContainer from '../Navigation/NavigationContainer.svelte';
  import Icon from '../Icon/Icon.svelte';
  import {store} from '../../store/store';
  import {onExit} from '../../utils/onEnter';
  import CreativeDetail from '../CreativeDetail/CreativeDetail.svelte';

  let isMobileDevice: boolean;

  let canvasElement: HTMLCanvasElement;
  let scene: Scene;

  let progress: number;
  let isPlaying: boolean;
  let layoutContainer: HTMLElement;
  let audio: HTMLAudioElement;
  let soundIsMuted: boolean;

  let canvasContainerRef: HTMLElement;

  store.audioController.subscribe(value => {
    audio = value;
  });

  store.isMuted.subscribe(value => {
    soundIsMuted = value;
  });

  window.addEventListener('keydown', e => {
    if (e.key === 'm') {
      store.isMuted.update(value => !value);

      if (soundIsMuted) {
        audio.pause();
      } else {
        audio.play();
      }
    }
  });

  store.currentSession.subscribe(value => {
    isPlaying = value;
  });

  store.progressRatio.subscribe(value => {
    progress = value;
  });

  store.isMobileDevice.subscribe(value => {
    isMobileDevice = value;
  });

  store.layoutContainer.subscribe(value => {
    layoutContainer = value;
  });

  onMount(() => {
    if (canvasElement && canvasContainerRef) {
      scene = new Scene(canvasElement);

      store.canvasContainer.update(() => canvasContainerRef);
    }
  });
</script>

<div class="canvas-container" bind:this={canvasContainerRef}>
  <CreativeDetail />
  <canvas class="webgl__canvas" bind:this={canvasElement} />

  <div class="scene-header">
    {#if isPlaying}
      <div
        on:click={e => {
          onExit(layoutContainer);
        }}
        class="exit-container"
      >
        <Icon icon={IconType.close} />
      </div>

      <div
        on:click={e => {
          store.isMuted.update(value => !value);

          if (soundIsMuted) {
            audio.pause();
          } else {
            audio.play();
          }
        }}
        class="sound-icon"
      >
        {#if soundIsMuted}
          <Icon icon={IconType.headphoneMuted} />
        {:else}
          <Icon icon={IconType.headphone} />
        {/if}
      </div>
    {/if}
  </div>

  {#if progress === 100 && isPlaying}
    <NavigationContainer>
      <Keys>
        <div class="keys">
          <div
            on:touchstart={e => {
              scene.events.forward = true;
            }}
            on:touchend={e => {
              scene.events.forward = false;
            }}
            class="up"
          >
            {#if isMobileDevice}
              <Icon icon={IconType.up} />
            {:else}
              <Icon icon={IconType.w} />
            {/if}
          </div>

          <div
            class="bottom"
            on:touchstart={e => {
              scene.events.backward = true;
            }}
            on:touchend={e => {
              scene.events.backward = false;
            }}
          >
            {#if isMobileDevice}
              <Icon icon={IconType.bottom} />
            {:else}
              <Icon icon={IconType.s} />
            {/if}
          </div>

          <div
            class="left"
            on:touchstart={e => {
              scene.events.left = true;
            }}
            on:touchend={e => {
              scene.events.left = false;
            }}
          >
            {#if isMobileDevice}
              <Icon icon={IconType.left} />
            {:else}
              <Icon icon={IconType.a} />
            {/if}
          </div>

          <div
            class="right"
            on:touchstart={e => {
              scene.events.right = true;
            }}
            on:touchend={e => {
              scene.events.right = false;
            }}
          >
            {#if isMobileDevice}
              <Icon icon={IconType.right} />
            {:else}
              <Icon icon={IconType.d} />
            {/if}
          </div>
        </div>

        {#if !isMobileDevice}
          <p class="arrow-text">Use these keys to navigate</p>
        {/if}
      </Keys>

      {#if !isMobileDevice}
        <IconWithText icon={IconType.mouse} message={'Use your mouse to look around'} />
        <IconWithText icon={IconType.escape} message={'Press escape to leave the experience'} />
        <IconWithText icon={IconType.soundKey} message={'Press the M key to toggle the sound'} />
      {:else}
        <IconWithText icon={IconType.phone} message={'Rotate your device to look around'} />
      {/if}
    </NavigationContainer>
  {/if}
</div>

<style type="text/scss">
  @import '../../styles/styles.scss';
  .canvas-container {
    position: fixed;
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .webgl__canvas {
      position: fixed;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      z-index: 0;
    }

    .arrow-text {
      font-family: $font-text-light;
    }

    .scene-header {
      position: relative;
      display: flex;
      width: 100%;
      padding: 25px;
      justify-content: space-between;
      .sound-icon {
        z-index: 1;
        touch-action: none;
        width: 25px;
      }
      .exit-container {
        display: flex;
        align-items: center;
        touch-action: none;
        z-index: 1;
        width: 25px;
        transition: 0.175s ease-in-out;
      }
    }

    .keys {
      position: relative;
      width: 175px;
      height: 172px;
      user-select: none;
      -webkit-touch-callout: none;
      -webkit-user-select: none;
      -khtml-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;

      .up,
      .left,
      .bottom,
      .right {
        position: absolute;
        user-select: initial;
        touch-action: none;
      }
      .up {
        top: 13%;
        left: 50%;
        width: 50px;
        transform: translate(-50%, 0);
      }

      .bottom {
        bottom: 15%;
        left: 50%;
        width: 50px;
        transform: translate(-50%, -15%);
      }

      .left {
        bottom: 15%;
        left: 0;
        width: 50px;
        transform: translate(0, -15%);
      }

      .right {
        bottom: 15%;
        right: 0;
        width: 50px;
        transform: translate(0, -15%);
      }
    }

    p {
      font-family: $font-text;
      color: #363636;
      margin: 0;
      text-align: center;
      font-size: 12px;
    }
  }

  @media screen and (min-width: 1028px) {
    .canvas-container {
      .scene-header {
        padding: 50px;
      }
      .keys {
        width: 100px;
        height: 100px;

        .up,
        .left,
        .right,
        .bottom {
          width: 25px;
        }

        .up {
          top: 35%;
          left: 50%;

          transform: translate(-50%, 0);
        }
        .bottom {
          bottom: 0;
          left: 50%;
          transform: translate(-50%, 0);
        }
        .left {
          bottom: 0;
          left: 0;
        }
        .right {
          bottom: 0;
          right: 0;
        }
      }
    }
  }
</style>
