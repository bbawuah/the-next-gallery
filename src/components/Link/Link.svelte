<script lang="ts">
  export let href: string;
</script>

<a {href} class="link" target="_blank"><slot /></a>

<style type="text/scss">
  @import '../../styles/styles.scss';

  .link {
    text-decoration: none;
    color: $color-dark-grey;
    letter-spacing: -0.05em;
    font-family: $font-title-regular;
    font-weight: 700;
  }
</style>
