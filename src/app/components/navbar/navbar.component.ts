import { Component, OnInit } from '@angular/core';
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
    private logger: LoggerService
  ) {}

  @logIO
  test(bool: boolean): boolean {
    this.alert.toast('Subscribed!', 'success');
    this.logger.log('Payload', '');
    return !bool;
  }

  ngOnInit(): void {}
}
