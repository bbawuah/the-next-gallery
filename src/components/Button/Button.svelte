<script lang="ts">
  export let onClick: () => void;
  export let text: string;
  export let isDisabled: boolean;
  export let type: 'button' | 'menu' | 'reset' | 'submit';
</script>

<button {type} disabled={isDisabled} on:click={onClick} class="button">{text}</button>

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

    &:disabled {
      cursor: not-allowed;
      background-color: $color-white;
      color: $color-dark-grey;
    }
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
