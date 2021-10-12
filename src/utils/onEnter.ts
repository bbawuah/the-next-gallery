import GSAP from 'gsap';
import type {PointerLockControls} from 'three/examples/jsm/controls/PointerLockControls';
import {playerIsInScene, pointerLockerControls} from '../store/store';

export const onEnter = (el: HTMLElement): void => {
  let pointerLockerctrls: PointerLockControls;

  GSAP.to(el, {duration: 0.5, opacity: 0});

  pointerLockerControls.subscribe(value => {
    pointerLockerctrls = value;
  });

  playerIsInScene.update(() => true);

  // Add small delay before setting display to none
  setTimeout(() => {
    el.style.display = 'none';
  }, 500);

  if (pointerLockerctrls) {
    pointerLockerctrls.lock();
    pointerLockerctrls.addEventListener('unlock', () => {
      GSAP.to(el, {duration: 0.5, opacity: 1});
      el.style.display = 'grid';
      playerIsInScene.update(() => false);
    });
  }

  playerIsInScene.update(() => true);
};
