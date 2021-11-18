import App from './App.svelte';
import * as THREE from 'three';

window.THREE = THREE;

export default new App({
  target: document.body
});
