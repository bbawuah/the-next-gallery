<script lang="ts">
  import classNames from 'classnames';

  export let hasBackground: boolean = false;
  export let hasWhole: boolean = false;

  const classes = classNames('content-section', {
    ['background']: hasBackground,
    ['whole']: hasWhole
  });
</script>

<section class={classes}>
  <slot />
</section>

<style>
  .content-section {
    width: 100vw;
    height: 100vh;
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

  .content-section.whole {
    position: relative;
    overflow: hidden;
  }

  .content-section.whole:before {
    content: '';
    position: absolute;
    top: 15%;
    width: 75%;
    height: 150%;
    border-radius: 45%;
    box-shadow: 0px 100px 200px 1000px #fff;
  }
</style>
