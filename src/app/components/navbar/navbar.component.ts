import { Component, OnInit } from '@angular/core';
import { SweetAlertService } from 'src/app/services/sweetAlert.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  public testButton = true;
  constructor(private alert: SweetAlertService) {}

  ngOnInit(): void {}

  test(): void {
    this.alert.toast('Subscribed!', 'success');
  }
}
