<script lang="ts">
  import type {IconType} from '../../utils/icons/types/IconType';
  import icons from '../../utils/icons/icons.json';

  export let icon: IconType;
</script>

<i class="icon">{@html icons[icon]}</i>

<style type="text/scss">
  .icon {
    :global(svg) {
      pointer-events: none;
    }
  }
</style>
