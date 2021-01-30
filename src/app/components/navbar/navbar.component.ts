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
  async test2(bool: boolean): Promise<boolean> {
    const payLoad = {
      username: 'jaime5',
      password: '123'
    };
    const apiResponse = await this.api.login(payLoad);
    return apiResponse;
  }

  async test(bool: boolean): Promise<boolean> {
    const payLoad = {
      username: 'jaime55',
      password: '1234',
      code: '6955037335'
    };
    const apiResponse = await this.api.register(payLoad);
    return apiResponse;
  }

  ngOnInit(): void {}
}
