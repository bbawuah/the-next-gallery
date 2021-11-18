import App from './App.svelte';
import * as THREE from 'three';

window.THREE = THREE;

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./service-worker.js', {scope: '.'});
}

export default new App({
  target: document.body
});
