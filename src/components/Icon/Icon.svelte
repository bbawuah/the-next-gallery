<script lang="ts">
  import type {IconType} from '../../utils/icons/types/IconType';
  import icons from '../../utils/icons/icons.json';
  import classNames from 'classnames';

  export let icon: IconType;
  export let size: 'small' | 'medium' | 'large' = 'medium';

  const classes = classNames('icon', {
    small: size === 'small',
    medium: size === 'medium',
    large: size === 'large'
  });
</script>

<i class={classes}>{@html icons[icon]}</i>

<style type="text/scss">
  .icon {
    :global(svg) {
      pointer-events: none;
      width: 100%;
      height: 100%;
    }
  }
  .small {
    :global(svg) {
      transform: scale(0.7);
    }
  }
</style>
