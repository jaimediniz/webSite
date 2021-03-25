import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie';
import { APIService } from '@services/backend.service';
import { logIO } from '@services/logger.service';
import { SweetAlertService } from '@services/sweetAlert.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {
  // Control buttons
  public homeButton = true;
  public activitiesButton = true;
  public loginButton = true;
  public registerButton = true;
  public scheduleButton = true;
  public aboutButton = true;

  public adminButton = false;
  public logoffButton = false;
  public chatButton = false;
  public feedbackButton = false;

  constructor(
    private alert: SweetAlertService,
    private api: APIService,
    private cookieService: CookieService,
    private router: Router
  ) {
    if (this.cookieService.get('Role') === 'admin') {
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
    const payload = await this.alert.register();

    if (!payload) {
      return false;
    }

    const apiResponse = await this.api.register(payload);
    return apiResponse;
  }

  ngOnInit(): void {}

  async login(): Promise<void> {
    const payload = await this.alert.login();
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
