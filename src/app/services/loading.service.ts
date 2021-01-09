import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { LoggerService } from './logger.service';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  public loading$: Subject<boolean> = new Subject();

  constructor(private logger: LoggerService) {}

  startLoading() {
    this.logger.debug('Start Loading Screen');
    this.loading$.next(true);
  }

  stopLoading() {
    this.logger.debug('Stop Loading Screen');
    this.loading$.next(false);
  }
}
