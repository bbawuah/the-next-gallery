<script lang="ts">
  export let number: number;
</script>

<p class="progress-meter">{number}</p>

<style type="text/scss">
  @import '../../styles/styles.scss';

  .progress-meter {
    font-family: $font-text-bold;
    font-size: 8rem;
    z-index: 2;
    position: absolute;
    left: 50%;
    top: 50%;
    margin: 0;
    transform: translate(-50%, -50%);
    color: #383838;
  }
</style>
