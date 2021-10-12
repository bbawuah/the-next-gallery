import {Writable, writable} from 'svelte/store';
import type {PointerLockControls} from 'three/examples/jsm/controls/PointerLockControls';

// progress ratio of loading assets
export const progressRatio: Writable<number> = writable(0);

// Boolean that returns whether the player is in the game
export const playerIsInScene: Writable<boolean> = writable(false);

// Pointerlockercontrols
export const pointerLockerControls: Writable<PointerLockControls> = writable();

export const layoutContainer: Writable<HTMLElement> = writable();
