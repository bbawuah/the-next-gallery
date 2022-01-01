<script lang="ts">
  import type {Navigator} from 'webxr';
  import Container from './components/Container/Container.svelte';
  import Scene from './components/webgl/Scene.svelte';
  import {store} from './store/store';

  let webXRIsSupported: boolean;
  let webXRNavigator: Navigator = navigator as any as Navigator;

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('./service-worker.js').then(
        function (registration) {
          // Registration was successful
          console.log('ServiceWorker registration successful with scope: ', registration.scope);
        },
        function (err) {
          // registration failed :(
          console.log('ServiceWorker registration failed: ', err);
        }
      );
    });
  }

  store.xrIsSupported.subscribe(value => {
    webXRIsSupported = value;
  });

  if ('xr' in webXRNavigator) {
    webXRNavigator.xr.isSessionSupported('immersive-vr').then(supported => {
      webXRIsSupported = supported;
      store.xrIsSupported.update(() => supported);
    });
  }
</script>

<main>
  <Container />
  <Scene />
</main>

<style type="text/scss">
  @import './styles/styles.scss';

  :global(*) {
    box-sizing: border-box;
  }

  :global(body) {
    padding: 0;
    background-color: #ffe7d3;
    width: 100vw;
    user-select: none;
    touch-action: pan-y;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
  }

  main {
    width: 100%;
    user-select: none;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
  }
</style>
