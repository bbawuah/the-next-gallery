<script lang="ts">
  export let number: number;
</script>

<div class="container">
  <p class="progress-meter">{number}%</p>
  <p class="text">Loading the gallery..</p>
</div>

<style type="text/scss">
  @import '../../styles/styles.scss';

  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: $font-text-bold;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 2;
    color: $color-white;

    .progress-meter {
      font-size: 2rem;
      margin: 0;
    }

    .text {
      text-align: center;
      font-size: 1rem;
    }
  }

  @media screen and (min-width: 1024px) {
    .container {
      .progress-meter {
        font-size: 3.5rem;
      }

      .text {
        font-size: 1.75rem;
      }
    }
  }
</style>
