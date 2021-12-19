<script lang="ts">
  import classNames from 'classnames';

  export let hasBackground: boolean = false;

  const classes = classNames('content-section', {
    ['background']: hasBackground
  });
</script>

<section class={classes}>
  <slot />
</section>

<style>
  .content-section {
    width: 100vw;
    height: 75vh;
    padding: 25px;
    display: grid;
    justify-items: center;
    align-items: center;
    position: relative;
  }

  .background {
    background-color: #fff;
    height: 100vh;
  }
</style>
