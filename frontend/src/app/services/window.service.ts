import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LoggerService } from './logger.service';

const getBaseWindow = (): Window => window as any;

@Injectable({
  providedIn: 'root'
})
export class WindowService {
  public deferredPromptSubject = new BehaviorSubject<any>(undefined);
  public isInStandaloneMode = false;

  private windowEl: any;

  constructor(private logger: LoggerService) {
    this.windowEl = getBaseWindow();
    this.installPrompt();
  }

  getWindow(): Window {
    return this.windowEl;
  }

  installPrompt(): void {}

  getDisplayMode(): void {
    this.getWindow().addEventListener('DOMContentLoaded', () => {
      let displayMode = 'browser tab';
      if ((navigator as any).standalone) {
        displayMode = 'standalone-ios';
      }
      if (window.matchMedia('(display-mode: standalone)').matches) {
        displayMode = 'standalone';
      }

      // Log launch display mode to analytics
      this.logger.log('DISPLAY_MODE_LAUNCH:', displayMode);

      if (displayMode === 'browser tab') {
        this.isInStandaloneMode = false;
      }
      this.isInStandaloneMode = true;
    });
  }
}
