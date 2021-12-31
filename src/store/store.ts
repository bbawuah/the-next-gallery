import {Writable, writable} from 'svelte/store';
import type {DeviceOrientationControls} from 'three/examples/jsm/controls/DeviceOrientationControls';
import type {PointerLockControls} from 'three/examples/jsm/controls/PointerLockControls';
import {mobileCheck} from '../utils/mobileCheck';

const audio = new Audio('./static/sound/ambient-sound.mp3');
audio.loop = true;
audio.volume = 0.125;

class Store {
  public progressRatio: Writable<number>;
  public currentSession: Writable<boolean>;
  public pointerLockerControls: Writable<PointerLockControls>;
  public deviceOrientation: Writable<DeviceOrientationControls>;
  public canvasContainer: Writable<HTMLElement>;
  public audioController: Writable<HTMLAudioElement>;
  public isMuted: Writable<boolean>;
  public xrIsSupported: Writable<boolean>;
  public layoutContainer: Writable<HTMLElement>;
  public isMobileDevice: Writable<boolean>;
  public scrollSpeed: Writable<number>;
  public creativeIndex: Writable<number>;
  public vrSession: Writable<boolean>;

  constructor() {
    this.progressRatio = writable(0);
    this.currentSession = writable(false);
    this.pointerLockerControls = writable();
    this.isMobileDevice = writable(mobileCheck());
    this.deviceOrientation = writable();
    this.canvasContainer = writable();
    this.layoutContainer = writable();
    this.audioController = writable(audio);
    this.isMuted = writable(false);
    this.xrIsSupported = writable();
    this.scrollSpeed = writable(0);
    this.creativeIndex = writable(null);
    this.vrSession = writable(false);
  }
}

export const store = new Store();
