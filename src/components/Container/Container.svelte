<script lang="ts">
  import LocomotiveScroll from 'locomotive-scroll';
  import {onMount} from 'svelte';
  import ParagraphContainer from '../ParagraphContainer/ParagraphContainer.svelte';
  import {store} from '../../store/store';
  import {onEnter} from '../../utils/onEnter';
  import Link from '../Link/Link.svelte';
  import Button from '../Button/Button.svelte';

  let progress: number;
  let svgElement: SVGSVGElement;
  let pathElement: SVGPathElement;
  let textPathElement: SVGTextPathElement;

  let layoutContainer: HTMLElement;
  let isMobile: boolean;
  let onMouseOver: () => void;
  let onMouseLeave: () => void;

  const updateTextPathOffset = (offset: number) => {
    textPathElement.setAttribute('startOffset', offset.toString());
  };

  const onScroll = () => {
    requestAnimationFrame(() => {
      const rect = svgElement.getBoundingClientRect();
      const pathLength = pathElement.getTotalLength();
      const scrollPercentage = rect.y / window.innerHeight;
      updateTextPathOffset(scrollPercentage * 0.1 * pathLength);
    });
  };

  store.progressRatio.subscribe(value => {
    progress = value;
  });

  store.isMobileDevice.subscribe(value => {
    isMobile = value;
  });

  store.layoutContainer.subscribe(value => {
    layoutContainer = value;
  });

  store.progressRatio.subscribe(value => {
    progress = value;
  });

  onMount(() => {
    if (layoutContainer) {
      store.layoutContainer.update(() => layoutContainer);

      if (!isMobile) {
        const scroll = new LocomotiveScroll({
          el: document.querySelector('[data-scroll-container]'),
          smooth: true,
          lerp: 0.099999999,
          getSpeed: true
        });

        scroll.on('scroll', ev => {
          const speed = ev.speed < 0.1 && ev.speed > -0.1 ? 0.0 : ev.speed;
          store.scrollSpeed.update(() => speed);
        });
      }

      if (svgElement && textPathElement && pathElement) {
        window.addEventListener('scroll', onScroll);
      }
    }
  });
</script>

<section class="container" bind:this={layoutContainer} data-scroll-container={true}>
  <ParagraphContainer hasWhole={true}>
    <p
      class="text styled-text landing"
      data-scroll-speed="-4.0"
      data-scroll={true}
      data-scroll-direction={'horizontal'}
    >
      THE NEXT
    </p>
    <div class="landing-content-container">
      <h1 class="text">A digital showcase of creatives and talents in a way you’ve never seen before.</h1>

      {#if progress !== 100}
        <p>Loading the experience.. {progress}%</p>
      {/if}
    </div>
    <p
      class="text styled-text landing"
      data-scroll-speed="3.75"
      data-scroll={true}
      data-scroll-direction={'horizontal'}
    >
      GALLERY
    </p>
  </ParagraphContainer>

  <ParagraphContainer hasBackground={true}>
    <div>
      <p class="text">
        The Next Gallery is an immersive digital experience that showcases a selection of creatives and talents.
      </p>
      <p class="text">
        Virtual and augmented reality is rapidly becoming a part of our daily lives. It is incorporated in public
        discourse and impacting our societies in multiple ways. The creative fields must not be left behind in these
        advancements.
      </p>
      <p class="text">
        The Next Gallery introduces you to a virtual world full of inspirational creatives who are expressing their
        talents, arts and crafts in unique ways.
      </p>
    </div>

    <svg
      bind:this={svgElement}
      class="text-path"
      width="679"
      height="65"
      viewBox="0 0 679 65"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        bind:this={pathElement}
        id="curve"
        fill="transparent"
        d="M1 32.4999C60 8.83325 206.6 -24.3001 321 32.4999C435.4 89.2999 607 56.1666 678.5 32.4999"
      />
      <text width="679">
        <textPath bind:this={textPathElement} xlink:href="#curve">
          Inspire Inspire Inspire Inspire Inspire Inspire</textPath
        >
      </text>
    </svg>
  </ParagraphContainer>

  <ParagraphContainer>
    <div class="outro">
      <p class="text styled-text impact">IMPACT</p>
      <p class="text">
        Each individual is successful in their own way and on their own terms. The creation of their impactful art began
        the moment they started listening and following the directions of their heart.
      </p>
      <p class="text">Special thanks to all the creatives that participated in this gallery.</p>

      <p class="text">Enjoy the gallery ❤️</p>
    </div>

    <Button
      isDisabled={progress !== 100}
      onClick={e => {
        e.preventDefault();
        onEnter(layoutContainer);
      }}
      text={progress !== 100 ? 'Loading the gallery..' : 'Enter gallery'}
      type={'button'}
    />

    <footer class="footer">
      <p class="copyright">
        INSPIRED BY <Link href="https://shutdown.gallery/">THE SHUTDOWN.GALLERY</Link>. MADE WITH <Link
          href="https://svelte.dev/">SVELTE</Link
        > AND
        <Link href="https://threejs.org/">THREEJS.</Link> CREATED BY <Link
          href="https://github.com/bbawuah/the-next-gallery">BRIAN BAWUAH</Link
        >
      </p>
    </footer>
  </ParagraphContainer>
</section>

<style type="text/scss">
  @import '../../styles/styles.scss';

  .container {
    display: flex;
    flex-direction: column;
    position: absolute;
    width: 100%;
    z-index: 2;
    opacity: 1;
    overflow: hidden;
    touch-action: pan-y;
    user-select: none;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;

    @keyframes lineairAnimation {
      0% {
        top: 0.125px;
      }

      50% {
        top: 4px;
      }

      100% {
        top: 0.125px;
      }
    }
  }
  .text {
    width: 100%;
    max-width: 650px;
    font-size: 22.125px;
    line-height: 129.49%;
    font-family: $font-title-regular;
    letter-spacing: -0.025em;
    color: $color-dark-grey;
    text-align: center;
  }

  .landing-content-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: $font-title-italic;

    p {
      font-size: 1.5rem;
    }
  }
  h1.text {
    font-family: $font-title-italic;
    z-index: 0;
  }
  .text.styled-text {
    font-family: $font-title-regular;
    font-size: 3.5rem;
    margin: 0;
    width: auto;
  }

  .text.styled-text.landing:nth-of-type(1) {
    position: absolute;
    left: 0%;
    top: 80px;
  }

  .text-path {
    position: absolute;
    left: 0;
    bottom: 50%;
    width: 100vw;
    height: 50%;
    transform: translate(0, 50%);
    opacity: 0.2;
  }

  textPath {
    font-family: $font-title-regular;
    font-size: 4rem;
    text-transform: uppercase;
    fill: #88725f;
  }

  .text.styled-text.landing:nth-of-type(2) {
    position: absolute;
    right: 2%;
    bottom: 0;
  }

  .text.styled-text.impact {
    color: $color-dark-grey;
  }

  .outro {
    z-index: 1;
    align-self: flex-end;
  }

  .footer {
    align-self: flex-end;
    margin-bottom: 20px;
    text-align: center;
    max-width: 600px;
    .copyright {
      margin: 0;
      font-family: $font-title-regular;
      font-weight: 300;
    }
  }

  @media screen and (min-width: 1028px) {
    .text.styled-text.landing:nth-of-type(1) {
      left: -7.5%;
      top: 0px;
    }

    .text.styled-text.landing:nth-of-type(2) {
      right: 10%;
    }
    .text {
      font-size: 25px;
    }

    .text-path {
      bottom: 50%;
    }

    textPath {
      font-size: 2rem;
    }

    .text.styled-text {
      font-size: 5.5rem;
      margin: 0;
    }
  }

  @media screen and (min-width: 1450px) {
    .text {
      font-size: 35px;
    }

    .text.styled-text {
      font-size: 7.5rem;
    }
  }
</style>
