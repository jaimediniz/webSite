import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DarkService } from './shared/services/dark.service';

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

  public darkTheme = false;

  public fullScreen = false;
  public showOutlet = false;

  constructor(private route: ActivatedRoute, private darkService: DarkService) {
    this.route.queryParams.subscribe((params) => {
      this.fullScreen = params.fullScreen || false;
    });
    this.darkTheme = this.darkService.darkTheme;
    this.darkService.darkThemeEmitter.subscribe((darkTheme: boolean) => {
      this.darkTheme = darkTheme;
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
