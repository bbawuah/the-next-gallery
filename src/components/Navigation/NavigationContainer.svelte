<script lang="ts">
</script>

<div class="navigation-container">
  <slot />
</div>

<style type="text/scss">
  .navigation-container {
    position: absolute;
    display: flex;
    justify-content: space-around;
    bottom: 18px;
    left: 0;
    width: 100%;
    z-index: 1;
  }

  @media screen and (min-width: 600px) {
    .navigation-container {
      display: grid;
      justify-content: initial;
      grid-template-columns: 130px 130px 130px;
      grid-gap: 10px;
      position: absolute;
      left: 25px;
    }
  }
</style>
