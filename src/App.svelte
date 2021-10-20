<script lang="ts">
  import type {Navigator} from 'webxr';
  import Button from './components/Button/Button.svelte';
  import Layout from './components/Layout/Layout.svelte';
  import Link from './components/Link/Link.svelte';
  import ParagraphContainer from './components/ParagraphContainer/ParagraphContainer.svelte';
  import ProgressMeter from './components/ProgressMeter/ProgressMeter.svelte';
  import Scene from './components/webgl/Scene.svelte';
  import {layoutContainer, progressRatio, xrIsSupported} from './store/store';
  import {onEnter} from './utils/onEnter';

  let progress: number;
  let layoutElement: HTMLElement;
  let webXRIsSupported: boolean;
  let webXRNavigator: Navigator = navigator as any as Navigator;

  const year = new Date().getFullYear();

  if ('xr' in webXRNavigator) {
    webXRNavigator.xr.isSessionSupported('immersive-vr').then(supported => {
      webXRIsSupported = supported;
      xrIsSupported.update(() => supported);
    });
  }

  layoutContainer.subscribe(value => {
    layoutElement = value;
  });

  progressRatio.subscribe(value => {
    progress = value;
  });

  xrIsSupported.subscribe(value => {
    webXRIsSupported = value;
  });
</script>

<main>
  <Layout>
    <section class="content-left-wrapper" slot="content-left">
      <ParagraphContainer>
        <p class="text">A digital showcase of creatives and talents in a way you’ve never seen before.</p>
      </ParagraphContainer>

      <ParagraphContainer>
        <p class="text">
          The Next Gallery is an immersive digital experience that showcases a selection of creatives and talents based
          in the Netherlands in a unique way using emerging technologies.
        </p>
      </ParagraphContainer>

      <ParagraphContainer>
        <div>
          <p class="text">
            From artificial intelligence and machine learning to virtual and augmented reality, Emerging technologies
            are beginning to impact our societies and shape our public discourse.
          </p>
          <p class="text">
            But the conversations in our community around how these tools are influencing, and will continue to mould,
            the creative fields of art and design are still really in their infancy.
          </p>
        </div>
      </ParagraphContainer>

      <ParagraphContainer>
        <div>
          <p class="text">
            The Next Gallery overwrites virtual information onto your real-world environment using extended reality.
          </p>
          <p class="text">
            It opens a new virtual world as a source of inspiration for creatives who want to express their talent and
            art and craft in unique ways.
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
          text={'Enter gallery'}
          type={'button'}
        />

        <footer class="footer">
          <p class="copyright">Copyright &copy; {year} <Link href="https://github.com/bbawuah">Brian Bawuah</Link></p>
        </footer>
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
  }

  .content-left-wrapper {
    height: 100%;
  }

  .text {
    width: 100%;
    max-width: 650px;
    font-size: 20px;
    line-height: 129.49%;
    font-family: $font-text-light;
    letter-spacing: -0.025em;
    color: $color-light-grey;
    text-align: center;
  }

  .outro {
    align-self: flex-end;
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

  @media screen and (min-width: 870px) {
    .text {
      font-size: 25px;
    }
  }

  @media screen and (min-width: 1450px) {
    .text {
      font-size: 35px;
    }
  }
</style>
