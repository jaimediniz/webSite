import { Component, OnInit } from '@angular/core';
import { API } from 'src/app/services/backend.service';
import { SweetAlertService } from 'src/app/services/sweetAlert.service';

import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  constructor(private alert: SweetAlertService) {}

  ngOnInit(): void {}

  test(): void {
    this.alert.fireQuestion('test', 'test', 'question', 'Confirm', 'Cancel');
  }
}
