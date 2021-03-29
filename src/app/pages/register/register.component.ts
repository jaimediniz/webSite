import { Component, OnDestroy, OnInit } from '@angular/core'; // Importing libraries
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { APIService } from '@services/backend.service';
import { External } from '@interfaces/database';
import { LoadingService } from '@app/shared/services/loading.service';

@Component({
  // Angular stuff: Needs to be declared for every components
  selector: 'app-register', // How we are going to use this component inside HTML(<app-register></app-register>)
  templateUrl: './register.component.html', // Linking this .ts file with HTML file
  styleUrls: ['./register.component.scss'] // Linking this .ts file with CSS file
})
export class RegisterComponent implements OnInit, OnDestroy {
  // This is just the syntax, declaring the variables and assigning it
  public currentUrl: SafeResourceUrl;
  public showInfo = true;
  public form = '';

  // This is variable that can be subscribed by the others and pass information
  private routeSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private api: APIService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private loading: LoadingService
  ) {
    this.routeSubscription = this.route.paramMap.subscribe((paramMap) => {
      if (paramMap.get('form')) {
        this.form = paramMap.get('form') ?? '';
        this.updateState();
      } else {
        this.showInfo = true;
        this.form = '';
        this.currentUrl = this.sanitizer.bypassSecurityTrustResourceUrl('');
      }
    });
  }

  ngOnInit(): void {}

  updateState() {
    // Collect the information from the DB
    const form = this.form.charAt(0).toUpperCase() + this.form.slice(1);
    if (document.getElementById('loader')) {
      (document.getElementById('loader') as any).style.display = 'flex';
    }
    this.api
      .getExternal(`registration${form}Form`) //registration${form}Form: variable linked to the DB
      .then((result: External[]) => this.updateSrc(result[0].value));
  }

  changeUrl(param: string) {
    //to update the URL for the page without completely navigation to a new page
    this.form = param;
    this.router.navigate(['/register', param]);
  }

  updateSrc(url: string) {
    this.showInfo = false;
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
