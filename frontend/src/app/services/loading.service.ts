import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { LoggerService } from './logger.service';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  public loading$: Subject<boolean> = new Subject();
  private preventStop = false;

  constructor(private logger: LoggerService) {}

  startLoading() {
    this.logger.log('Start Loading Screen');
    this.loading$.next(true);
  }

  stopLoading() {
    if (this.preventStop) {
      return;
    }
    this.logger.log('Stop Loading Screen');
    this.loading$.next(false);
  }

  manualStart() {
    this.preventStop = true;
    this.startLoading();
  }

  manualStop() {
    this.preventStop = false;
    this.stopLoading();
  }
}
