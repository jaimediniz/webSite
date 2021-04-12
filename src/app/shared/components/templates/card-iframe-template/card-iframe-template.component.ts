import { Component, Input, OnDestroy, OnInit } from '@angular/core'; // Importing libraries
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-card-iframe-template',
  templateUrl: './card-iframe-template.component.html',
  styleUrls: ['./card-iframe-template.component.scss']
})
export class CardIframeTemplateComponent implements OnInit, OnDestroy {
  @Input() basicRoute: string;
  @Input() formName: string;
  @Input() cards: {
    route: string;
    title: string;
    content: string;
    url: string;
  }[];

  // This is just the syntax, declaring the variables and assigning it
  public currentUrl: SafeResourceUrl;
  public showInfo = true;
  public form = '';

  // This is variable that can be subscribed by the others and pass information
  private routeSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private router: Router
  ) {}

  ngOnInit(): void {
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

  async startLoader(): Promise<void> {
    const loader = document.getElementById('loader');
    if (loader) {
      (loader as any).style.display = 'flex';
    }
  }

  async stopLoader(): Promise<void> {
    const loader = document.getElementById('loader');
    if (loader) {
      (loader as any).style.display = 'none';
    }
  }

  async updateState(form: string): Promise<void> {
    await this.startLoader();
    const url = this.cards.filter((el) => el.route === form) ?? [{ url: '' }];
    this.updateSrc(url[0].url);
  }

  changeUrl(param: string): void {
    //to update the URL for the page without completely navigation to a new page
    this.form = param;
    this.router.navigate([this.basicRoute, param]);
  }

  updateSrc(url: string): void {
    this.showInfo = false;
    //changes the source in the iframe effectively changing the form
    const oldUrl = (this.currentUrl as any)
      ?.changingThisBreaksApplicationSecurity;
    if (oldUrl !== '' && oldUrl === url) {
      return;
    }
    this.currentUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
  }
}
