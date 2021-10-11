<script lang="ts">
  import {IconType} from '../../utils/icons/types/IconType';
  import Icon from '../Icon/Icon.svelte';
  import GSAP from 'gsap';
  import {onMount} from 'svelte';
  import {progressRatio} from '../../store/store';

  let callToAction: HTMLElement;
  let isHovered: boolean = false;

  let onMouseOver: () => void;
  let onMouseLeave: () => void;

  let progress: number;

  progressRatio.subscribe(value => {
    console.log(value);
    progress = value;
  });

  onMount(() => {
    if (callToAction) {
      onMouseOver = () => {
        if (progress === 100) {
          GSAP.to(callToAction, {duration: 0.5, opacity: 1});
        }
      };

      onMouseLeave = () => {
        GSAP.to(callToAction, {duration: 0.5, opacity: 0});
      };
    }
  });
</script>

<section class="container">
  <section class="column-left">
    <div class="icon-container">
      <Icon icon={IconType.logo} />
    </div>

    <slot name="content-left" />
  </section>

  <section class="column-right" on:mouseover={onMouseOver} on:focus={onMouseOver} on:mouseleave={onMouseLeave}>
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
