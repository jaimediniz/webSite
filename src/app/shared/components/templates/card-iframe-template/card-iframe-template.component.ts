import { Component, Input, OnDestroy, OnInit } from '@angular/core'; // Importing libraries
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { APIService } from '@services/backend.service';
import { External } from '@interfaces/database';

@Component({
  selector: 'app-card-iframe-template',
  templateUrl: './card-iframe-template.component.html',
  styleUrls: ['./card-iframe-template.component.scss']
})
export class CardIframeTemplateComponent implements OnInit, OnDestroy {
  @Input() basicRoute: string;
  @Input() formName: string;
  @Input() cards: { route: string; title: string; content: string }[];

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
    private router: Router
  ) {
    this.routeSubscription = this.route.paramMap.subscribe((paramMap) => {
      if (paramMap.get('form')) {
        this.form = paramMap.get('form') ?? '';
        this.updateState(this.form);
      } else {
        this.showInfo = true;
        this.form = '';
        this.currentUrl = this.sanitizer.bypassSecurityTrustResourceUrl('');
      }
    });
  }

  ngOnInit(): void {}

  updateState(form: string) {
    // Collect the information from the DB
    if (document.getElementById('loader')) {
      (document.getElementById('loader') as any).style.display = 'flex';
    }
    this.api
      .getExternal(`${this.formName}Form_${this.form}`) // ${this.formName}Form_${form}: variable linked to the DB
      .then((result: External[]) => this.updateSrc(result[0].value))
      .catch((error: any) => {
        this.router.navigate([this.basicRoute, '']);
      });
  }

  changeUrl(param: string) {
    //to update the URL for the page without completely navigation to a new page
    this.form = param;
    this.router.navigate([this.basicRoute, param]);
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
