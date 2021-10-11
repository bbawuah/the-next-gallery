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
    width: 50%;
    font-size: 25px;
    margin: 0;
    cursor: pointer;
  }
</style>
