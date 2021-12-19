<script lang="ts">
  import LocomotiveScroll from 'locomotive-scroll';
  import {onMount} from 'svelte';
  import ParagraphContainer from '../ParagraphContainer/ParagraphContainer.svelte';
  import {store} from '../../store/store';
  import {onEnter} from '../../utils/onEnter';
  import {IconType} from '../../utils/icons/types/IconType';
  import Link from '../Link/Link.svelte';
  import Icon from '../Icon/Icon.svelte';
  import Button from '../Button/Button.svelte';

  let progress: number;

  let layoutContainer: HTMLElement;
  let isMobile: boolean;
  let onMouseOver: () => void;
  let onMouseLeave: () => void;

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
          lerp: 0.3,
          getSpeed: true
        });

        scroll.on('scroll', ev => {
          const speed = ev.speed < 0.1 && ev.speed > -0.1 ? 0.0 : ev.speed;
          store.scrollSpeed.update(() => speed);
        });
      }
    }
  });
</script>

<section class="container" bind:this={layoutContainer} data-scroll-container={true}>
  <ParagraphContainer hasBackground={true}>
    <p
      class="text styled-text landing"
      data-scroll-speed="-1.75"
      data-scroll={true}
      data-scroll-direction={'horizontal'}
    >
      THE NEXT
    </p>
    <h1 class="text">A digital showcase of creatives and talents in a way you’ve never seen before.</h1>
    <p
      class="text styled-text landing"
      data-scroll-speed="3.75"
      data-scroll={true}
      data-scroll-direction={'horizontal'}
    >
      GALLERY
    </p>
    <div class="logo-top">
      <Icon icon={IconType.close} />
    </div>
  </ParagraphContainer>

  <ParagraphContainer>
    <p class="text styled-text inspire" data-scroll-speed="2.75" data-scroll={true} data-scroll-direction={'vertical'}>
      INSPIRE
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
  </ParagraphContainer>

  <ParagraphContainer>
    <p class="text styled-text impact">IMPACT</p>
  </ParagraphContainer>

  <ParagraphContainer hasBackground={true}>
    <div class="outro">
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
        INSPIRED BY <Link href="https://shutdown.gallery/">THE SHUTDOWN.GALLERY</Link>. THANKS TO <Link
          href="https://svelte.dev/">SVELTE</Link
        >,
        <Link href="https://threejs-journey.com/">THREEJS-JOURNEY</Link>,
        <Link href="https://threejs.org/">THREEJS</Link>,
        <Link href="https://twitter.com/NikLever">NIKLEVER</Link>,
        <Link href="https://tympanus.net/codrops/2020/06/02/kinetic-typography-with-three-js/">MARIO CARILLO</Link>,
        <Link href="https://developers.google.com/web/fundamentals/primers/service-workers">MATT GAUNT</Link>. MADE BY <Link
          href="https://github.com/bbawuah/the-next-gallery">BRIAN BAWUAH</Link
        >
      </p>
    </footer>
    <div class="logo-bottom">
      <Icon icon={IconType.close} />
    </div>
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
    font-family: $font-text-light;
    letter-spacing: -0.025em;
    color: $color-light-grey;
    text-align: center;
  }

  .text.styled-text {
    font-size: 5.5rem;
    margin: 0;
    width: auto;
  }

  .text.styled-text.landing:nth-of-type(1) {
    position: absolute;
    left: -10%;
    top: 0;
    font-family: $font-text-regular;
  }

  .text.styled-text.landing:nth-of-type(2) {
    position: absolute;
    right: -10%;
    bottom: 0;
    font-family: $font-text-regular;
  }

  .text.styled-text.inspire {
    position: absolute;
    left: auto;
    bottom: 10%;
    color: $color-white;
    font-family: $font-text-regular;
  }

  .text.styled-text.impact {
    position: absolute;
    bottom: 10%;
    color: $color-white;
    font-family: $font-text-regular;
  }

  .outro {
    z-index: 1;
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

  .logo-top {
    position: absolute;
    left: -60%;
    width: 100%;
    bottom: -5px;
    opacity: 0.075;
  }

  .logo-bottom {
    position: absolute;
    opacity: 0.075;
    right: -60%;
    width: 100%;
    bottom: -5px;
  }

  @media screen and (min-width: 1028px) {
    .text {
      font-size: 25px;
    }

    .text.styled-text {
      font-size: 5.5rem;
      margin: 0;
    }

    .text.styled-text.landing:nth-of-type(1) {
      left: -7%;
    }

    .text.styled-text.landing:nth-of-type(2) {
      right: 10%;
    }
    .text.styled-text.inspire {
      bottom: 20%;
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
