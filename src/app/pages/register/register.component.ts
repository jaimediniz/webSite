import { Component, OnDestroy, OnInit } from '@angular/core'; // Importing libraries
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { APIService } from 'src/app/shared/services/backend.service';
import { External } from 'src/interfaces/database';

import { ResizedEvent } from 'angular-resize-event';

@Component({
  // Angular stuff: Needs to be declared for every components
  selector: 'app-register', // How we are going to use this component inside HTML(<app-register></app-register>)
  templateUrl: './register.component.html', // Linking this .ts file with HTML file
  styleUrls: ['./register.component.scss'] // Linking this .ts file with CSS file
})
export class RegisterComponent implements OnInit, OnDestroy {
  //To act as JS from the page
  width: any;
  height: any;

  isSmallScreen = false;
  minWidth = 769;

  // This is just the syntax, declaring the variables and assigning it
  public currentUrl: SafeResourceUrl;
  public showInfo = '';

  // This is variable that can be subscribed by the others and pass information
  private routeSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private api: APIService,
    private sanitizer: DomSanitizer,
    private router: Router
  ) {
    this.routeSubscription = this.route.paramMap.subscribe((paramMap) => {
      if (paramMap.get('form')) {
        this.showInfo = paramMap.get('form') ?? '';
        this.updateState();
      } else {
        this.showInfo = '';
      }
    });
    this.currentUrl = this.sanitizer.bypassSecurityTrustResourceUrl('');
  }

  ngOnInit(): void {}

  onResized(event: ResizedEvent) {
    this.width = event.newWidth;
    this.height = event.newHeight;
    this.isSmallScreen = this.width > this.minWidth;
  }

  updateState() {
    // Collect the information from the DB
    const form = this.showInfo.charAt(0).toUpperCase() + this.showInfo.slice(1);
    this.api
      .getExternal(`registration${form}Form`) //registration${form}Form: variable linked to the DB
      .then((result: External[]) => this.updateSrc(result[0].value));
  }

  changeUrl(param: string) {
    //to update the URL for the page without completely navigation to a new page
    this.router.navigate(['/register', param]);
  }

  updateSrc(url: string) {
    //changes the source in the iframe effectively changing the form
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
