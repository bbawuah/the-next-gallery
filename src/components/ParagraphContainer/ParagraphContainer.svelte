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
    min-height: 100vh;
    height: 100%;
    padding: 25px;
    display: grid;
    justify-items: center;
    align-items: center;
    position: relative;
  }

  .background {
    background-color: #ffe7d3;
    min-height: 100vh;
    height: 100%;
  }

  .content-section.whole {
    position: relative;
    overflow: hidden;
  }

  .content-section.whole:before {
    content: '';
    position: absolute;
    top: 30%;
    width: 200%;
    height: 150%;
    border-radius: 45%;
    box-shadow: 0px 100px 200px 1000px #ffe7d3;
  }

  @media screen and (min-width: 1028px) {
    .content-section.whole:before {
      top: 15%;
      width: 75%;
    }
  }
</style>
