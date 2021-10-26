import {Writable, writable} from 'svelte/store';
import type {DeviceOrientationControls} from 'three/examples/jsm/controls/DeviceOrientationControls';
import type {PointerLockControls} from 'three/examples/jsm/controls/PointerLockControls';
import {mobileCheck} from '../utils/mobileCheck';

// progress ratio of loading assets
export const progressRatio: Writable<number> = writable(0);

// Boolean that returns whether the player is in the game
export const currentSession: Writable<boolean> = writable(false);

// Pointerlockercontrols
export const pointerLockerControls: Writable<PointerLockControls> = writable();

export const layoutContainer: Writable<HTMLElement> = writable();

export const isMobileDevice: Writable<boolean> = writable(mobileCheck());

export const deviceOrientation: Writable<DeviceOrientationControls> = writable();

export const canvasContainer: Writable<HTMLElement> = writable();

const audio = new Audio('./static/sound/ambient-sound.mp3');
audio.loop = true;
audio.volume = 0.125;

export const audioController: Writable<HTMLAudioElement> = writable(audio);

export const hasMutedSound: Writable<boolean> = writable(false);

export const xrIsSupported: Writable<boolean> = writable();
