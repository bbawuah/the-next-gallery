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
  @import '../../../styles/styles.scss';

  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 140px;
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
      color: $color-dark-grey;
      margin: 0;
      font-size: 11px;
      text-align: center;
      -webkit-touch-callout: none;
      -webkit-user-select: none;
      -khtml-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
    }

    @media screen and (min-width: 600px) {
      p {
        font-size: 12px;
      }
    }
  }
</style>
