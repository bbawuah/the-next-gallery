import GSAP from 'gsap';
import type {DeviceOrientationControls} from 'three/examples/jsm/controls/DeviceOrientationControls';
import type {PointerLockControls} from 'three/examples/jsm/controls/PointerLockControls';
import {
  currentSession,
  pointerLockerControls,
  isMobileDevice as mobileDeviceSubscriber,
  deviceOrientation as deviceOrientationSubscriber,
  audioController,
  hasMutedSound
} from '../store/store';

let audio: HTMLAudioElement;
export const interval = 250;

let soundIsMuted: boolean;

hasMutedSound.subscribe(value => {
  soundIsMuted = value;
});

export const onEnter = (el: HTMLElement): void => {
  let pointerLockerctrls: PointerLockControls;
  let isMobileDevice: boolean;
  let deviceOrientation: DeviceOrientationControls;

  GSAP.to(el, {duration: 0.5, opacity: 0});

  audioController.subscribe(value => {
    audio = value;
  });

  pointerLockerControls.subscribe(value => {
    pointerLockerctrls = value;
  });

  mobileDeviceSubscriber.subscribe(value => {
    isMobileDevice = value;
  });

  deviceOrientationSubscriber.subscribe(value => {
    deviceOrientation = value;
  });

  currentSession.update(() => true);

  playSound(audio);

  setTimeout(() => {
    el.style.display = 'none';
  }, 500);

  if (isMobileDevice) {
    deviceOrientation.connect();
  } else {
    if (pointerLockerctrls) {
      pointerLockerctrls.lock();
      pointerLockerctrls.addEventListener('unlock', () => {
        audio.pause();

        GSAP.to(el, {duration: 0.5, opacity: 1});
        el.style.display = 'grid';
        currentSession.update(() => false);
      });
    }
  }

  currentSession.update(() => true);
};

export const onExit = (el: HTMLElement): void => {
  pauseSound(audio);
  let deviceOrientation: DeviceOrientationControls;

  deviceOrientationSubscriber.subscribe(value => {
    deviceOrientation = value;
  });

  deviceOrientation.disconnect();

  GSAP.to(el, {duration: 0.5, opacity: 1});
  el.style.display = 'grid';
  currentSession.update(() => false);
};

export function playSound(sound: HTMLAudioElement): void {
  if (!soundIsMuted) {
    sound.volume = 0;
    sound.play();

    const fadeIn = setInterval(() => {
      sound.volume += 0.05;

      if (sound.volume === 0.2) {
        clearInterval(fadeIn);
      }
    }, interval);
  }
}

export function pauseSound(sound: HTMLAudioElement): void {
  if (!soundIsMuted) {
    sound.pause();
  }
}
