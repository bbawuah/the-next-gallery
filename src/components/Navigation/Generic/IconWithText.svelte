<script lang="ts">
  import type {IconType} from '../../../utils/icons/types/IconType';
  import Icon from '../../Icon/Icon.svelte';

  export let icon: IconType;
  export let message: string;
</script>

<div class="container">
  <div class="wrapper">
    <div class="icon">
      <Icon {icon} />
    </div>
  </div>

  <p>{message}</p>
</div>

<style type="text/scss">
  @font-face {
    font-family: 'HelveticaNeue-light';
    src: url('/fonts/HelveticaNeue-Light-08.ttf') format('truetype');
  }

  $font-fallback: 'OpenSans', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell',
    'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  $font-text-light: 'HelveticaNeue-light', $font-fallback;

  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 140px;
    .wrapper {
      width: 100%;
      height: 100px;
      position: relative;
      margin-bottom: 8px;

      .icon {
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translate(-50%, 0);
      }
    }

    p {
      font-family: $font-text-light;
      color: #363636;
      margin: 0;
      text-align: center;
    }
  }
</style>
