<script lang="ts">
  import {onMount} from 'svelte';

  let container: HTMLDivElement;

  onMount(() => {
    if (container) {
      container.addEventListener('touchmove', e => {
        e.preventDefault();
      });

      container.addEventListener('dblclick', e => {
        e.preventDefault();
      });

      container.addEventListener('click', e => {
        e.preventDefault();
      });
    }
  });
</script>

<div class="keys-container" bind:this={container}>
  <slot />
</div>

<style type="text/scss">
  .keys-container {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    user-select: none;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
  }
</style>
