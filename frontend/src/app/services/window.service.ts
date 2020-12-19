import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

function _getWindow(): any {
  // return the native window obj
  return window;
}

@Injectable({
  providedIn: 'root'
})
export class WindowService {
  private _window: any;
  public deferredPromptSubject = new BehaviorSubject<any>(undefined);
  public isInStandaloneMode = false;

  constructor() {
    this._window = _getWindow();
    this.installPrompt();
  }

  getWindow() {
    return this._window;
  }

  installPrompt() {
    this.getWindow().addEventListener('beforeinstallprompt', (event: any) => {
      event.preventDefault();
      console.log(event);
      this.deferredPromptSubject.next(event);
    });
  }

  getDisplayMode() {
    this.getWindow().addEventListener('DOMContentLoaded', () => {
      let displayMode = 'browser tab';
      if ((navigator as any).standalone) {
        displayMode = 'standalone-ios';
      }
      if (window.matchMedia('(display-mode: standalone)').matches) {
        displayMode = 'standalone';
      }

      // Log launch display mode to analytics
      console.log('DISPLAY_MODE_LAUNCH:', displayMode);

      if (displayMode === 'browser tab') {
        this.isInStandaloneMode = false;
      }
      this.isInStandaloneMode = true;
    });
  }
}
