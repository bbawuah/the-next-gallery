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
        layoutContainer.style.display = 'none';

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
    <div class="icon-container">
      <Icon icon={IconType.logo} />
    </div>

    <slot name="content-left" />
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
    grid-template-columns: 50% 50%;
    width: 100%;
    height: 100%;
    z-index: 2;
    opacity: 1;

    .column-left,
    .column-right {
      padding: 50px;
    }

    .column-left {
      background-color: $color-white;
      overflow-y: scroll;

      .icon-container {
        position: fixed;
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
        font-size: 2rem;
        font-family: $font-text-bold;
        color: $color-white;
      }
    }

    .column-right:hover {
      background-color: rgba(143, 143, 143, 0.623);
    }
  }
</style>
