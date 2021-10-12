<script lang="ts">
  import {IconType} from '../../utils/icons/types/IconType';
  import Icon from '../Icon/Icon.svelte';
  import GSAP from 'gsap';
  import {onMount} from 'svelte';
  import {playerIsInScene, pointerLockerControls, progressRatio} from '../../store/store';
  import type {PointerLockControls} from 'three/examples/jsm/controls/PointerLockControls';

  let callToAction: HTMLParagraphElement;
  let layoutContainer: HTMLElement;

  let onMouseOver: () => void;
  let onMouseLeave: () => void;
  let onClick: () => void;

  let progress: number;
  let pointerLockerctrls: PointerLockControls;
  let isPlaying: boolean;

  progressRatio.subscribe(value => {
    progress = value;
  });

  pointerLockerControls.subscribe(value => {
    pointerLockerctrls = value;
  });

  playerIsInScene.subscribe(value => {
    isPlaying = value;
  });

  onMount(() => {
    if (callToAction && layoutContainer) {
      onMouseOver = () => {
        if (progress === 100) {
          GSAP.to(callToAction, {duration: 0.5, opacity: 1});
        }
      };

      onMouseLeave = () => {
        GSAP.to(callToAction, {duration: 0.5, opacity: 0});
      };

      onClick = () => {
        GSAP.to(layoutContainer, {duration: 0.5, opacity: 0});

        // Add small delay before setting display to none
        setTimeout(() => {
          layoutContainer.style.display = 'none';
        }, 500);

        pointerLockerctrls.lock();

        pointerLockerctrls.addEventListener('unlock', () => {
          GSAP.to(layoutContainer, {duration: 0.5, opacity: 1});
          layoutContainer.style.display = 'grid';

          playerIsInScene.update(() => false);
        });

        playerIsInScene.update(() => true);
      };
    }
  });
</script>

<section class="container" bind:this={layoutContainer}>
  <section class="column-left">
    <div class="logo-container">
      <Icon icon={IconType.logo} size={'small'} />
    </div>

    <slot name="content-left" />

    <div class="arrow-container">
      <p class="scroll-text">scroll</p>
      <Icon size={'small'} icon={IconType.arrowDown} />
    </div>
  </section>

  <section
    class="column-right"
    on:mouseover={onMouseOver}
    on:focus={onMouseOver}
    on:mouseleave={onMouseLeave}
    on:click={onClick}
  >
    <slot name="content-right" />

    <p class="call-to-action" bind:this={callToAction}>Enter gallery</p>
  </section>
</section>

<style type="text/scss">
  @import '../../styles/styles.scss';

  .container {
    display: grid;
    position: absolute;
    grid-template-columns: 100%;
    grid-template-rows: 60% 40%;
    width: 100%;
    height: 100%;
    z-index: 2;
    opacity: 1;

    .column-right {
      padding: 50px;
    }

    .column-left {
      background-color: $color-white;
      overflow-y: scroll;
      position: relative;
      padding: 0 25px;

      .logo-container {
        position: fixed;
        width: 100px;
      }

      .arrow-container {
        position: absolute;
        bottom: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 10px;
        left: 50%;
        transform: translate(-50%, 0);

        .scroll-text {
          margin: 0;
          font-family: $font-text-light;
          font-size: 15px;
        }
      }
    }

    .column-right {
      position: relative;
      transition: 0.175s ease-in-out;
      cursor: pointer;

      .call-to-action {
        position: absolute;
        opacity: 0;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        font-size: 1.35rem;
        font-family: $font-text-bold;
        color: $color-white;
      }
    }

    .column-right:hover {
      background-color: rgba(143, 143, 143, 0.623);
    }
  }
  @media screen and (min-width: 870px) {
    .container {
      grid-template-columns: 50% 50%;
      grid-template-rows: unset;

      .column-left {
        padding: 50px;
        .logo-container {
          width: unset;
        }
      }

      .column-right {
        .call-to-action {
          font-size: 2rem;
        }
      }
    }
  }
</style>
