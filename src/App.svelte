<script lang="ts">
  import Icon from './components/Icon/Icon.svelte';
  import Layout from './components/Layout/Layout.svelte';
  import ParagraphContainer from './components/ParagraphContainer/ParagraphContainer.svelte';
  import ProgressMeter from './components/ProgressMeter/ProgressMeter.svelte';

  import Scene from './components/webgl/Scene.svelte';
  import {progressRatio} from './store/store';
  import {IconType} from './utils/icons/types/IconType';

  let progress: number;

  progressRatio.subscribe(value => {
    progress = value;
  });
</script>

<main>
  <Layout>
    <div class="content-left-wrapper" slot="content-left">
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
            Emerging technologies, from artificial intelligence and machine learning to virtual and augmented reality,
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
            The Next Gallery overwrites virtual information onto your real-world environment using Augmented and Virtual
            Reality.
          </p>
          <p class="text">
            It opens a new virtual world as a source of inspiration for creatives who want to express their talent and
            art in unique ways.
          </p>
        </div>
      </ParagraphContainer>

      <ParagraphContainer>
        <div>
          <p class="text">Special thanks to all the creatives that participated in this gallery.</p>
          <p class="text">Enjoy the gallery ❤️</p>
        </div>
      </ParagraphContainer>
    </div>

    <div slot="content-right">
      {#if progress !== 100}
        <ProgressMeter slot="content-right" number={progress} />
      {/if}
      <p>Some text</p>
    </div>
  </Layout>

  <Scene />
</main>

<style type="text/scss">
  @import './styles/styles.scss';

  :global(body) {
    padding: 0;
  }

  .content-left-wrapper {
    height: 100%;
  }

  .text {
    width: 650px;
    font-size: 35px;
    line-height: 129.49%;
    font-family: $font-text-regular;
    letter-spacing: -0.05em;
    color: #696969;
    text-align: center;
  }
</style>
