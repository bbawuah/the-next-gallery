<script lang="ts">
  import {IconType} from '../../../utils/icons/types/IconType';
  import Icon from '../../Icon/Icon.svelte';
</script>

<div class="keys-container">
  <div class="keys">
    <div class="up">
      <Icon icon={IconType.up} />
    </div>

    <div class="bottom">
      <Icon icon={IconType.bottom} />
    </div>

    <div class="left">
      <Icon icon={IconType.left} />
    </div>

    <div class="right">
      <Icon icon={IconType.right} />
    </div>
  </div>

  <p>Use the arrows to navigate</p>
</div>

<style type="text/scss">
  @font-face {
    font-family: 'HelveticaNeue-light';
    src: url('/fonts/HelveticaNeue-Light-08.ttf') format('truetype');
  }

  $font-fallback: 'OpenSans', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell',
    'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  $font-text-light: 'HelveticaNeue-light', $font-fallback;

  .keys-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    .keys {
      position: relative;
      width: 100px;
      height: 100px;
      margin-bottom: 8px;

      .up {
        position: absolute;
        top: 35%;
        left: 50%;
        transform: translate(-50%, 0);
      }

      .bottom {
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translate(-50%, 0);
      }

      .left {
        position: absolute;
        bottom: 0;
        left: 0;
      }

      .right {
        position: absolute;
        bottom: 0;
        right: 0;
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
