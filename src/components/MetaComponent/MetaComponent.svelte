<script lang="ts">
  import GSAP from 'gsap';
  import {store} from '../../store/store';
  import {IconType} from '../../utils/icons/types/IconType';
  import {portraitNames} from '../../utils/metaData';
  import Icon from '../Icon/Icon.svelte';

  let creativeIndex: number = 0;
  let shouldRenderLink: boolean = false;
  let metaContainer: HTMLElement;
  let currentSession: boolean;
  let isMobile: boolean;

  store.isMobileDevice.subscribe(value => {
    isMobile = value;
  });

  const handleEvent = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      window.open(portraitNames[creativeIndex].instagram, '__blank');
    }
  };

  store.creativeIndex.subscribe(index => {
    if (metaContainer) {
      if (typeof index === 'number') {
        creativeIndex = index;

        GSAP.to(metaContainer, {duration: 0.5, opacity: 1});
        metaContainer.style.display = 'flex';

        if (portraitNames[index].instagram) {
          window.addEventListener('keydown', handleEvent, true);
        }
      } else {
        window.removeEventListener('keydown', handleEvent, true);
        GSAP.to(metaContainer, {duration: 0.5, opacity: 0});

        setTimeout(() => {
          metaContainer.style.display = 'none';
        }, 500);
      }
    }
  });

  store.currentSession.subscribe(v => {
    currentSession = v;
  });
</script>

{#if currentSession}
  <section bind:this={metaContainer}>
    <div class="container">
      <h3>{portraitNames[creativeIndex].name}</h3>
      <p>{portraitNames[creativeIndex].description}</p>

      {#if portraitNames[creativeIndex].instagram}
        <div class="link-container">
          <a href={portraitNames[creativeIndex].instagram} target="__blank" class="instagram-icon">
            <Icon icon={IconType.instagram} />
          </a>

          {#if !isMobile}
            <p>Press enter to visit Instagram</p>
          {:else}
            <p>Tab to visit Instagram</p>
          {/if}
        </div>
      {/if}
    </div>
  </section>
{/if}

<style type="text/scss">
  @import '../../styles/styles.scss';

  section {
    position: fixed;
    top: 0;
    right: 0;
    width: 100%;
    height: 400px;
    z-index: 10;
    padding: 40px 25px;
    background-color: rgba(134, 134, 134, 0.5);
    background: linear-gradient(
      360deg,
      rgba(102, 102, 102, 0) 0%,
      rgba(192, 192, 192, 0.4) 35%,
      rgba(255, 231, 211, 0.9) 100%
    );
    display: none;
    opacity: 0;
    justify-content: space-evenly;

    .container {
      max-width: 600px;
      width: 100%;
      color: #3f3f3f;

      h3 {
        font-family: $font-title-italic;
        font-size: 1.75rem;
      }

      p {
        font-size: 1rem;
        font-family: $font-title-regular;
      }

      .link-container {
        font-family: $font-title-regular;
        display: flex;
        align-items: center;
        width: max-content;
        font-size: 0.75rem;
        .instagram-icon {
          margin-right: 10px;
          width: 23px;
        }
      }
    }
  }

  @media screen and (min-width: 1028px) {
    section {
      width: 35%;
      height: 100%;
      padding: 25px;

      background: linear-gradient(
        90deg,
        rgba(102, 102, 102, 0) 0%,
        rgba(192, 192, 192, 0.4) 35%,
        rgba(255, 231, 211, 0.9) 100%
      );
    }
  }

  @media screen and (min-width: 1450px) {
    section {
      padding: 25px;
      display: none;
      opacity: 0;
      justify-content: space-evenly;

      .container {
        max-width: 600px;
        width: 100%;
        color: #3f3f3f;

        h3 {
          font-size: 2.75rem;
        }

        p {
          font-size: 1.5rem;
        }

        .link-container {
          display: flex;
          align-items: center;
          width: max-content;
          font-size: 1rem;
          .instagram-icon {
            margin-right: 10px;
            width: 30px;
          }
        }
      }
    }
  }
</style>
