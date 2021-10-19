<div class="navigation-container">
  <slot />
</div>

<style type="text/scss">
  .navigation-container {
    position: absolute;
    display: flex;
    justify-content: space-around;
    flex-direction: row-reverse;
    bottom: 15vh;
    touch-action: manipulation;
    left: 0;
    width: 100%;
    z-index: 1;
  }

  @media screen and (min-width: 600px) {
    .navigation-container {
      display: grid;
      justify-content: initial;
      flex-direction: unset;
      grid-template-columns: 130px 130px 130px 130px;
      grid-gap: 10px;
      position: absolute;
      left: 25px;
      bottom: 20px;
    }
  }
</style>
