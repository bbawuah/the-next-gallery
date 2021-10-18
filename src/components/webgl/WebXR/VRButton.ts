import GSAP from 'gsap';
import {currentSession} from '../../../store/store';
import type {Navigator} from 'webxr';

export class VRButton {
  private renderer: THREE.WebGLRenderer;
  private navigator: Navigator;
  private button: HTMLButtonElement;
  private message: HTMLAnchorElement;

  constructor(renderer: THREE.WebGLRenderer) {
    this.renderer = renderer;
    this.navigator = navigator as any as Navigator;
    this.button = document.createElement('button');
    this.message = document.createElement('a');

    currentSession.subscribe(value => {
      if (value) {
        GSAP.to(this.message, {duration: 0.25, left: '50%'});
        GSAP.to(this.button, {duration: 0.25, left: '50%'});
      } else {
        GSAP.to(this.message, {duration: 0.25, left: '75%'});
        GSAP.to(this.button, {duration: 0.25, left: '75%'});
      }
    });

    if ('xr' in this.navigator) {
      this.navigator.xr.isSessionSupported('immersive-vr').then(supported => {
        console.log(supported);
        supported ? this.showEnterVR(this.button) : this.showWebXRNotFound(this.button);
      });
      document.body.appendChild(this.button);
      this.button.textContent = 'ENTER VR';
    } else {
      if (window.isSecureContext === false) {
        this.message.href = document.location.href.replace(/^http:/, 'https:');
        this.message.innerHTML = 'WEBXR NEEDS HTTPS';
      } else {
        this.message.target = '__blank';
        this.message.href = 'https://immersiveweb.dev/';
        this.message.innerHTML = 'WEBXR NOT AVAILABLE';
      }

      this.message.style.textDecoration = 'none';
      this.message.style.opacity = '1';
      this.stylizeElement(this.message);

      document.body.appendChild(this.message);
    }
  }

  showEnterVR(button: HTMLButtonElement): void {
    let currentSession = null;
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;

    this.stylizeElement(button);

    function onSessionStarted(session) {
      session.addEventListener('end', onSessionEnded);

      self.renderer.xr.setSession(session);
      self.stylizeElement(button, 12);

      button.textContent = 'EXIT VR';

      currentSession = session;
    }

    function onSessionEnded(): void {
      currentSession.removeEventListener('end', onSessionEnded);

      self.stylizeElement(button);
      button.textContent = 'ENTER VR';

      currentSession = null;
    }

    button.style.display = '';
    button.style.cursor = 'pointer';

    button.onmouseenter = function () {
      button.style.fontSize = '12px';
      button.textContent = currentSession === null ? 'ENTER VR' : 'EXIT VR';
      button.style.opacity = '1.0';
    };

    button.onmouseleave = function () {
      button.style.opacity = '0.5';
    };

    button.onclick = function () {
      if (currentSession === null) {
        // WebXR's requestReferenceSpace only works if the corresponding feature
        // was requested at session creation time. For simplicity, just ask for
        // the interesting ones as optional features, but be aware that the
        // requestReferenceSpace call will fail if it turns out to be unavailable.
        // ('local' is always available for immersive sessions and doesn't need to
        // be requested separately.)

        const sessionInit = {optionalFeatures: ['local-floor', 'bounded-floor']};
        self.navigator.xr.requestSession('immersive-vr', sessionInit).then(onSessionStarted);
      } else {
        currentSession.end();
      }
    };
  }

  disableButton(button: HTMLButtonElement): void {
    button.style.cursor = 'auto';
    button.style.opacity = '0.5';

    button.onmouseenter = null;
    button.onmouseleave = null;

    button.onclick = null;
  }

  showWebXRNotFound(button: HTMLButtonElement): void {
    this.stylizeElement(button);

    this.disableButton(button);

    button.style.display = '';
    button.style.opacity = '1';
    button.textContent = 'VR NOT SUPPORTED';
  }

  stylizeElement(element: HTMLElement, fontSize = 13, ignorePadding = false): void {
    element.style.position = 'absolute';
    element.style.top = '50px';
    if (!ignorePadding) element.style.padding = '12px 6px';
    element.style.border = '1px solid #fff';
    element.style.borderRadius = '4px';
    element.style.color = '#fff';
    element.style.font = `normal ${fontSize}px sans-serif`;
    element.style.textAlign = 'center';
    element.style.opacity = '0.5';
    element.style.outline = 'none';
    element.style.height = 'max-content';
    element.style.width = 'max-content';
    element.style.zIndex = '999';
    element.style.left = '75%';
    element.style.background = 'transparent';
    element.style.transform = 'translate(-50%, 0)';
  }
}
