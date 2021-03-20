import {
  Component,
  ChangeDetectorRef,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import { Subscription } from 'rxjs';
import { LoadingService } from '@services/loading.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements AfterViewInit, OnDestroy {
  public hidden = true;
  loadingSubscription: Subscription;

  constructor(
    private loadingScreenService: LoadingService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngAfterViewInit(): void {
    this.loadingSubscription = this.loadingScreenService.loading$
      .pipe()
      .subscribe((status: boolean) => {
        this.hidden = status ? false : true;
        this.changeDetectorRef.detectChanges();
      });
  }

  ngOnDestroy() {
    this.loadingSubscription.unsubscribe();
  }
}
