<div class="navigation-container">
  <slot />
</div>

<style type="text/scss">
  .navigation-container {
    display: flex;
    justify-content: space-between;
    flex-direction: row-reverse;
    touch-action: none;
    left: 0;
    width: 100%;
    transition: 0.175s cubic-bezier(0.6, -0.28, 0.735, 0.045);
    z-index: 1;
    padding: 0 25px;
  }

  @media screen and (min-width: 1028px) {
    .navigation-container {
      display: grid;
      justify-content: initial;
      flex-direction: unset;
      grid-template-columns: 130px 130px 130px 130px;
      grid-gap: 10px;
      position: absolute;
      bottom: 0;
      padding: 25px;
    }
  }
</style>
