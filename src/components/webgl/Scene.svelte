<script lang="ts">
  import {onMount} from 'svelte';
  import Keys from '../Navigation/Keys/Keys.svelte';
  import IconWithText from '../Navigation/Generic/IconWithText.svelte';
  import {Scene} from './Scene';
  import {IconType} from '../../utils/icons/types/IconType';
  import NavigationContainer from '../Navigation/NavigationContainer.svelte';
  import Icon from '../Icon/Icon.svelte';
  import {
    currentSession,
    progressRatio,
    isMobileDevice as mobileDeviceSubscriber,
    layoutContainer,
    hasMutedSound,
    audioController,
    canvasContainer
  } from '../../store/store';
  import {onExit} from '../../utils/onEnter';

  let isMobileDevice: boolean;

  let canvasElement: HTMLCanvasElement;
  let scene: Scene;

  let progress: number;
  let isPlaying: boolean;
  let layoutElement: HTMLElement;
  let audio: HTMLAudioElement;
  let soundIsMuted: boolean;

  let canvasContainerRef: HTMLElement;

  audioController.subscribe(value => {
    audio = value;
  });

  hasMutedSound.subscribe(value => {
    soundIsMuted = value;
  });

  window.addEventListener('keydown', e => {
    if (e.key === 's') {
      hasMutedSound.update(value => !value);

      if (soundIsMuted) {
        audio.pause();
      } else {
        audio.play();
      }
    }
  });

  currentSession.subscribe(value => {
    isPlaying = value;
  });
  progressRatio.subscribe(value => {
    progress = value;
  });

  mobileDeviceSubscriber.subscribe(value => {
    isMobileDevice = value;
  });

  layoutContainer.subscribe(value => {
    layoutElement = value;
  });

  onMount(() => {
    if (canvasElement && canvasContainerRef) {
      scene = new Scene(canvasElement);

      canvasContainer.update(() => canvasContainerRef);
    }
  });
</script>

<div class="canvas-container" bind:this={canvasContainerRef}>
  <canvas class="webgl__canvas" bind:this={canvasElement} />

  <div class="scene-header">
    {#if isMobileDevice && isPlaying}
      <div
        on:click={e => {
          onExit(layoutElement);
        }}
        class="exit-container"
      >
        <Icon icon={IconType.close} />
      </div>
    {/if}

    <div
      on:click={e => {
        hasMutedSound.update(value => !value);

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
            <Icon icon={IconType.up} />
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
            <Icon icon={IconType.bottom} />
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
            <Icon icon={IconType.left} />
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
        <IconWithText icon={IconType.soundKey} message={'Press the S key to toggle the sound'} />
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

    .scene-header {
      position: relative;
      display: flex;
      width: 100%;
      justify-content: space-between;
      .sound-icon {
        position: absolute;
        right: 25px;
        top: 55px;
        z-index: 1;
        touch-action: none;
      }
    }

    .exit-container {
      position: absolute;
      display: flex;
      top: 55px;
      align-items: center;
      touch-action: none;
      left: 25px;
      z-index: 1;
      transition: 0.175s ease-in-out;
    }

    .keys {
      position: relative;
      width: 175px;
      height: 172px;
      touch-action: none;

      .up,
      .left,
      .bottom,
      .right {
        position: absolute;
        touch-action: manipulation;
      }
      .up {
        top: 35%;
        left: 50%;
        width: 50px;
        transform: translate(-50%, 0);
      }

      .bottom {
        bottom: 0;
        left: 50%;
        width: 50px;
        transform: translate(-50%, 0);
      }

      .left {
        bottom: 0;
        left: 0;
        width: 50px;
      }

      .right {
        bottom: 0;
        right: 0;
        width: 50px;
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

  @media screen and (min-width: 665px) {
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

      .scene-header {
        .sound-icon {
          position: absolute;
          right: 50px;
          top: 50px;
          z-index: 1;
        }
      }
    }
  }
</style>
