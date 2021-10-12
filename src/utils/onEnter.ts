import GSAP from 'gsap';
import type {DeviceOrientationControls} from 'three/examples/jsm/controls/DeviceOrientationControls';
import type {PointerLockControls} from 'three/examples/jsm/controls/PointerLockControls';
import {
  playerIsInScene,
  pointerLockerControls,
  isMobileDevice as mobileDeviceSubscriber,
  deviceOrientation as deviceOrientationSubscriber
} from '../store/store';

export const onEnter = (el: HTMLElement): void => {
  let pointerLockerctrls: PointerLockControls;
  let isMobileDevice: boolean;
  let deviceOrientation: DeviceOrientationControls;

  GSAP.to(el, {duration: 0.5, opacity: 0});

  pointerLockerControls.subscribe(value => {
    pointerLockerctrls = value;
  });

  mobileDeviceSubscriber.subscribe(value => {
    isMobileDevice = value;
  });

  deviceOrientationSubscriber.subscribe(value => {
    deviceOrientation = value;
  });

  playerIsInScene.update(() => true);

  // Add small delay before setting display to none
  setTimeout(() => {
    el.style.display = 'none';
  }, 500);

  if (isMobileDevice) {
    deviceOrientation.connect();
  } else {
    if (pointerLockerctrls) {
      pointerLockerctrls.lock();
      pointerLockerctrls.addEventListener('unlock', () => {
        GSAP.to(el, {duration: 0.5, opacity: 1});
        el.style.display = 'grid';
        playerIsInScene.update(() => false);
      });
    }
  }

  playerIsInScene.update(() => true);
};
