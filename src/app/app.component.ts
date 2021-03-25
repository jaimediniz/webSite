import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

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

  constructor(private route: ActivatedRoute) {
    this.route.queryParams.subscribe((params) => {
      this.fullScreen = params.fullScreen || false;
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
