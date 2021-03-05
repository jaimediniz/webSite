import { Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { APIService } from 'src/app/services/backend.service';
import { External } from 'src/interfaces/database';

import { ResizedEvent } from 'angular-resize-event';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {
  width: any;
  height: any;

  public currentUrl: SafeResourceUrl;
  public showInfo = '';

  private routeSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private api: APIService,
    private sanitizer: DomSanitizer,
    private router: Router
  ) {
    this.routeSubscription = this.route.paramMap.subscribe((paramMap) => {
      this.showInfo = paramMap.get('form') ?? '';
      this.updateState();
    });
    this.currentUrl = this.sanitizer.bypassSecurityTrustResourceUrl('');
  }

  ngOnInit(): void {}

  onResized(event: ResizedEvent) {
    this.width = event.newWidth;
    this.height = event.newHeight;
  }

  updateState() {
    const form = this.showInfo.charAt(0).toUpperCase() + this.showInfo.slice(1);
    this.api
      .getExternal(`registration${form}Form`)
      .then((result: External[]) => this.updateSrc(result[0].value));
  }

  changeUrl(param: string) {
    this.router.navigate(['/register', param]);
  }

  updateSrc(url: string) {
    const oldUrl = (this.currentUrl as any)
      ?.changingThisBreaksApplicationSecurity;
    if (oldUrl !== '' && oldUrl === url) {
      return;
    }
    this.currentUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
  }
}
