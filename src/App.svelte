<script lang="ts">
  import type {Navigator} from 'webxr';
  import Button from './components/Button/Button.svelte';
  import Icon from './components/Icon/Icon.svelte';
  import Layout from './components/Layout/Layout.svelte';
  import Link from './components/Link/Link.svelte';
  import ParagraphContainer from './components/ParagraphContainer/ParagraphContainer.svelte';
  import ProgressMeter from './components/ProgressMeter/ProgressMeter.svelte';
  import Scene from './components/webgl/Scene.svelte';
  import {store} from './store/store';
  import {metadata} from './utils/creativesMetadata/creativesMetaData';
  import {IconType} from './utils/icons/types/IconType';
  import {onEnter} from './utils/onEnter';

  let progress: number;
  let layoutElement: HTMLElement;
  let webXRIsSupported: boolean;
  let webXRNavigator: Navigator = navigator as any as Navigator;

  const year = new Date().getFullYear();

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./service-worker.js', {scope: '.'});
    console.log('test');
  }

  if ('xr' in webXRNavigator) {
    webXRNavigator.xr.isSessionSupported('immersive-vr').then(supported => {
      webXRIsSupported = supported;
      store.xrIsSupported.update(() => supported);
    });
  }

  store.layoutContainer.subscribe(value => {
    layoutElement = value;
  });

  store.progressRatio.subscribe(value => {
    progress = value;
  });

  store.xrIsSupported.subscribe(value => {
    webXRIsSupported = value;
  });
</script>

<main>
  <Layout>
    <section class="content-left-wrapper" slot="content-left">
      <ParagraphContainer>
        <h1 class="text">A digital showcase of creatives and talents in a way you’ve never seen before.</h1>
        <div class="logo-top">
          <Icon icon={IconType.close} />
        </div>
      </ParagraphContainer>

      <ParagraphContainer>
        <div>
          <p class="text">
            The Next Gallery is an immersive digital experience that showcases a selection of creatives and talents.
          </p>
          <p class="text">
            Virtual and augmented reality is rapidly becoming a part of our daily lives. It is incorporated in public
            discourse and impacting our societies in multiple ways. The creative fields must not be left behind in these
            advancements.
          </p>
        </div>
      </ParagraphContainer>

      <ParagraphContainer>
        <div>
          <p class="text">
            The Next Gallery introduces you to a virtual world full of inspirational creatives who are expressing their
            talents, arts and crafts in unique ways.
          </p>
        </div>
      </ParagraphContainer>

      <ParagraphContainer>
        <div>
          <p class="text">
            Each individual is successful in their own way and on their own terms. The creation of their impactful art
            began the moment they started listening and following the directions of their heart.
          </p>
        </div>
      </ParagraphContainer>
      <ParagraphContainer>
        <div class="outro">
          <p class="text">Special thanks to all the creatives that participated in this gallery.</p>

          <p class="text">Enjoy the gallery ❤️</p>
        </div>

        <Button
          isDisabled={progress !== 100}
          onClick={e => {
            e.preventDefault();
            onEnter(layoutElement);
          }}
          text={progress !== 100 ? 'Loading the gallery..' : 'Enter gallery'}
          type={'button'}
        />
      </ParagraphContainer>

      <ParagraphContainer>
        <div class="metadata-grid-container">
          <p class="metadata-title">Creatives</p>
          <div class="metadata-grid">
            {#each metadata as creative}
              <div class="metadata-container">
                <p>{creative.name}</p>

                {#if creative.instagram}
                  <a href={creative.instagram} target="__blank" class="instagram-icon">
                    <Icon icon={IconType.instagram} />
                  </a>
                {/if}
              </div>
            {/each}
          </div>
        </div>

        <footer class="footer">
          <p class="copyright">Copyright &copy; {year} <Link href="https://github.com/bbawuah">Brian Bawuah</Link></p>
        </footer>
        <div class="logo-bottom">
          <Icon icon={IconType.close} />
        </div>
      </ParagraphContainer>
    </section>

    <section slot="content-right">
      {#if progress !== 100}
        <ProgressMeter slot="content-right" number={progress} />
      {/if}
    </section>
  </Layout>

  <Scene />
</main>

<style type="text/scss">
  @import './styles/styles.scss';

  :global(*) {
    box-sizing: border-box;
  }

  :global(body) {
    padding: 0;
    width: 100vw;
    height: 100vh;
    user-select: none;
    touch-action: pan-y;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
  }

  main {
    height: 100%;
    width: 100%;
    user-select: none;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
  }

  .content-left-wrapper {
    height: 100%;
  }

  .text {
    width: 100%;
    max-width: 650px;
    font-size: 22.125px;
    line-height: 129.49%;
    font-family: $font-text-light;
    letter-spacing: -0.025em;
    color: $color-light-grey;
    text-align: center;
  }

  .outro {
    z-index: 1;
    align-self: flex-end;
  }

  .metadata-grid-container {
    margin: 30px 0;
    width: 100%;

    .metadata-title {
      font-family: $font-text-light;
      font-size: 20px;
      font-weight: 400;
      text-align: center;
    }

    .metadata-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      width: 100%;
      justify-items: center;

      .metadata-container {
        font-family: $font-text-light;
        display: flex;
        align-items: center;
        width: max-content;
        font-size: 13px;
        .instagram-icon {
          margin-left: 10px;
          width: 15px;
        }
      }
    }
  }

  .footer {
    align-self: flex-end;
    margin-bottom: 20px;
    .copyright {
      margin: 0;
      font-family: $font-text-light;
      font-weight: 300;
    }
  }

  .logo-top {
    position: absolute;
    left: -39%;
    width: 65%;
    bottom: -5px;
    opacity: 0.075;
  }

  .logo-bottom {
    position: absolute;
    opacity: 0.075;
    right: -33%;
    width: 65%;
    bottom: -5px;
  }

  @media screen and (min-width: 1028px) {
    .text {
      font-size: 25px;
    }

    .metadata-grid-container {
      margin: 65 0;
    }
  }

  @media screen and (min-width: 1450px) {
    .text {
      font-size: 35px;
    }
  }
</style>
