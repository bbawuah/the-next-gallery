import GSAP from 'gsap';
import type {PointerLockControls} from 'three/examples/jsm/controls/PointerLockControls';
import {store} from '../store/store';

let audio: HTMLAudioElement;
export const interval = 250;

let soundIsMuted: boolean;

store.isMuted.subscribe(value => {
  soundIsMuted = value;
});

export const onEnter = (el: HTMLElement): void => {
  let pointerLockerctrls: PointerLockControls;

  GSAP.to(el, {duration: 0.5, opacity: 0});

  store.audioController.subscribe(value => {
    audio = value;
  });

  store.pointerLockerControls.subscribe(value => {
    pointerLockerctrls = value;
  });

  store.currentSession.update(() => true);

  playSound(audio);

  handleSoundOnPageVisibility();

  setTimeout(() => {
    el.style.display = 'none';
  }, 500);

  if (pointerLockerctrls) {
    pointerLockerctrls.lock();
    pointerLockerctrls.addEventListener('unlock', () => {
      audio.pause();

      GSAP.to(el, {duration: 0.5, opacity: 1});
      el.style.display = 'block';

      store.currentSession.update(() => false);
    });
  }

  store.currentSession.update(() => true);
};

export const onExit = (el: HTMLElement): void => {
  pauseSound(audio);

  GSAP.to(el, {duration: 0.5, opacity: 1});
  el.style.display = 'block';

  store.currentSession.update(() => false);
};

function handleSoundOnPageVisibility() {
  const hidden = 'hidden';
  const visibilityChange = 'visibilitychange';

  document.addEventListener(visibilityChange, () => {
    if (document[hidden]) {
      audio.pause();
    } else {
      store.currentSession.subscribe(value => {
        if (value) {
          playSound(audio);
        }
      });
    }
  });
}

export function playSound(sound: HTMLAudioElement): void {
  if (!soundIsMuted) {
    sound.volume = 0.2;
    sound.play();
  }
}

export function pauseSound(sound: HTMLAudioElement): void {
  if (!soundIsMuted) {
    sound.pause();
  }
}
