<script lang="ts">
  import {IconType} from '../../utils/icons/types/IconType';

  import Icon from '../Icon/Icon.svelte';
</script>

<section class="container">
  <section class="column-left">
    <div class="icon-container">
      <Icon icon={IconType.logo} />
    </div>

    <slot name="content-left" />
  </section>

  <section class="column-right">
    <slot name="content-right" />
  </section>
</section>

<style type="text/scss">
  .container {
    display: grid;
    position: absolute;
    grid-template-columns: 50% 50%;
    width: 100%;
    height: 100%;
    z-index: 2;

    .column-left,
    .column-right {
      padding: 65px;
    }

    .column-left {
      background-color: #fff;
      overflow-y: scroll;

      .icon-container {
        position: fixed;
      }
    }

    .column-right {
      position: relative;
    }
  }
</style>
