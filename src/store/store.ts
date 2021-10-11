import {Writable, writable} from 'svelte/store';
import type {PointerLockControls} from 'three/examples/jsm/controls/PointerLockControls';

export const progressRatio: Writable<number> = writable(0);
export const playerIsInScene: Writable<boolean> = writable(false);
export const pointerLockerControls: Writable<PointerLockControls> = writable();
