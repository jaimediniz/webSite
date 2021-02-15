import { Component, OnInit } from '@angular/core';
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

  public aboutButton = false;
  public registerButton = false;
  public chatButton = false;
  public feedbackButton = false;

  // Test button is only showed in dev
  public testButton = !environment.production;

  constructor(private alert: SweetAlertService, private api: APIService) {}

  @logIO()
  async test(bool: boolean): Promise<boolean> {
    const apiResponse = await this.alert.uploadPicture();
    return apiResponse;
  }

  async register(bool: boolean): Promise<boolean> {
    const payLoad = await this.alert.loginOrRegister(true);

    if (!payLoad) {
      return false;
    }

    const apiResponse = await this.api.register(payLoad);
    return apiResponse;
  }

  async login(bool: boolean): Promise<boolean> {
    const payLoad = await this.alert.loginOrRegister();

    if (!payLoad) {
      return false;
    }

    const apiResponse = await this.api.login(payLoad);
    return apiResponse;
  }

  ngOnInit(): void {}
}
