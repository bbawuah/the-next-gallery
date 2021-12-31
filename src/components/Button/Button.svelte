<script lang="ts">
  export let onClick: (
    e: MouseEvent & {
      currentTarget: EventTarget & HTMLButtonElement;
    }
  ) => void;
  export let text: string;
  export let isDisabled: boolean;
  export let type: 'button' | 'menu' | 'reset' | 'submit';
</script>

<button {type} disabled={isDisabled} on:click={onClick} class="button">{text}</button>

<style type="text/scss">
  @import '../../styles/styles.scss';

  .button {
    padding: 20px;
    font-family: $font-title-regular;
    background-color: $color-dark-grey;
    color: $color-white;
    align-self: start;
    font-weight: 500;
    width: 100%;
    max-width: 450px;
    font-size: 22.125px;
    margin-top: 25px;
    cursor: pointer;
    border: none;
    outline: none;
    z-index: 1;

    &:disabled {
      cursor: not-allowed;
      background-color: $color-white;
      color: $color-dark-grey;
    }
  }

  @media screen and (min-width: 1028px) {
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
