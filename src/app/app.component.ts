import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Subscription } from 'rxjs';

import { ActivatedRoute } from '@angular/router';
import { DarkService } from './shared/services/dark.service';
import { LoadingService } from './shared/services/loading.service';
import { APIService } from './shared/services/backend.service';

@Component({
  selector: 'app-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  // @ViewChild('popupRouterOutlet', { read: ViewContainerRef })
  // private popupRouterOutlet: ViewContainerRef;
  // @ViewChild('popupContainer', { read: ViewContainerRef })
  // private popupContainer: ViewContainerRef;

  public fullScreen = false;
  public showOutlet = false;

  public loader = true;
  loadingSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private darkService: DarkService,
    private loadingScreenService: LoadingService,
    private api: APIService
  ) {
    this.api.cacheUIElements();
    this.route.queryParams.subscribe((params) => {
      this.fullScreen = params.fullScreen || false;
    });

    if (this.darkService.darkTheme) {
      document.body.classList.add('dark-theme');
    }
    this.darkService.darkThemeEmitter.subscribe((darkTheme: boolean) => {
      if (darkTheme) {
        document.body.classList.add('dark-theme');
      } else {
        document.body.classList.remove('dark-theme');
      }
    });

    this.loadingSubscription = this.loadingScreenService.loading$
      .pipe()
      .subscribe((status: boolean) => {
        this.loader = status ? false : true;
      });
  }

  ngOnInit(): void {}

  openSideRoute(event: any): void {
    this.showOutlet = true;
  }

  closeSideRoute(event: any): void {
    this.showOutlet = false;
  }
}
