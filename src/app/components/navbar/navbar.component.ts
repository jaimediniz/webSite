import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie';
import { APIService } from 'src/app/services/backend.service';
import { logIO } from 'src/app/services/logger.service';
import { SweetAlertService } from 'src/app/services/sweetAlert.service';

import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  public darkMode = false;

  // Control buttons
  public homeButton = true;
  public activitiesButton = true;
  public loginButton = true;

  public adminButton = false;
  public logoffButton = false;
  public aboutButton = false;
  public registerButton = false;
  public chatButton = false;
  public feedbackButton = false;

  // Test button is only showed in dev
  public testButton = !environment.production;

  constructor(
    private alert: SweetAlertService,
    private api: APIService,
    private cookieService: CookieService,
    private router: Router
  ) {
    if (this.cookieService.get('role') === 'admin') {
      this.loginButton = false;
      this.adminButton = true;
      this.logoffButton = true;
    }
  }

  @logIO()
  async test(bool: boolean): Promise<boolean> {
    const apiResponse = await this.alert.uploadPicture();
    return apiResponse;
  }

  async register(bool: boolean): Promise<boolean> {
    const payload = await this.alert.loginOrRegister(true);

    if (!payload) {
      return false;
    }

    const apiResponse = await this.api.register(payload);
    return apiResponse;
  }

  ngOnInit(): void {}

  async login(): Promise<void> {
    const payload = await this.alert.loginOrRegister();
    if (!payload || !payload.username || !payload.password) {
      return;
    }

    const success = await this.api.login(payload);

    if (!success) {
      return;
    }

    this.loginButton = false;
    this.adminButton = true;
    this.logoffButton = true;
  }

  async logoff() {
    this.cookieService.put('Role', 'user');
    this.cookieService.remove('Key');
    this.loginButton = true;
    this.adminButton = false;
    this.logoffButton = false;
    this.router.navigate(['home']);
    this.alert.toast('Logged off!', 'success', 'You are no longer logged.');
  }
}
