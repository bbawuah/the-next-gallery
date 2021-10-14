<script lang="ts">
  export let onClick: () => void;
  export let text: string;

  export let type: 'button' | 'menu' | 'reset' | 'submit';
</script>

<button {type} on:click={onClick} class="button">{text}</button>

<style type="text/scss">
  @import '../../styles/styles.scss';

  .button {
    padding: 20px;
    font-family: $color-dark-grey;
    background-color: $color-dark-grey;
    color: $color-white;
    align-self: start;
    width: 100%;
    font-size: 20px;
    margin-top: 25px;
    cursor: pointer;
  }

  @media screen and (min-width: 870px) {
    .button {
      font-size: 25px;
      max-width: 450px;
    }
  }

  @media screen and (min-width: 1450px) {
    .button {
      font-size: 35px;
    }
  }
</style>
