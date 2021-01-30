import { Component, OnInit } from '@angular/core';
import { APIService } from 'src/app/services/backend.service';
import { LoggerService, logIO } from 'src/app/services/logger.service';
import { SweetAlertService } from 'src/app/services/sweetAlert.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  public darkMode = false;
  public testButton = true;

  constructor(
    private alert: SweetAlertService,
    private logger: LoggerService,
    private api: APIService
  ) {}

  @logIO()
  async test(bool: boolean): Promise<boolean> {
    const apiResponse = await this.login(true);
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
