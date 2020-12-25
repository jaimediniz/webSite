import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  public loading$: Subject<boolean> = new Subject();
  private preventStop = false;

  constructor() {}

  startLoading() {
    console.log('Start Loading Screen');
    this.loading$.next(true);
  }

  stopLoading() {
    if (this.preventStop) {
      return;
    }
    console.log('Stop Loading Screen');
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
