<script lang="ts">
  import {IconType} from '../../../utils/icons/types/IconType';
  import Icon from '../../Icon/Icon.svelte';

  export let isMobileDevice: boolean;
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

  {#if !isMobileDevice}
    <p>Use the arrows to navigate</p>
  {/if}
</div>

<style type="text/scss">
  @import '../../../styles/styles.scss';

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
      font-size: 12px;
    }
  }
</style>
