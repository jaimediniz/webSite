import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { APIService } from 'src/app/services/backend.service';
import { External } from 'src/interfaces/database';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  public currentUrl: SafeUrl;

  constructor(private api: APIService, private sanitizer: DomSanitizer) {
    this.currentUrl = this.sanitizer.bypassSecurityTrustResourceUrl('');
    this.api
      .getExternal('registrationForm')
      .then((result: External[]) => this.updateSrc(result[0].value));
  }

  ngOnInit(): void {}

  updateSrc(url: string) {
    this.currentUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
