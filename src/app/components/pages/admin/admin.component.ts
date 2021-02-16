import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { SweetAlertService } from 'src/app/services/sweetAlert.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  public loginButton = true;
  public users: Array<{ id: number; name: string }>;

  constructor(
    private cookieService: CookieService,
    private alert: SweetAlertService
  ) {
    this.getUsers();
  }

  ngOnInit(): void {}

  async getUsers(): Promise<void> {
    const resp = {
      code: 200,
      error: false,
      message: '',
      data: [{ id: 1, name: 'Jaime' }]
    };

    if (resp.message.includes('should be removed')) {
      this.cookieService.remove('Admin');
      // Logoff
      return;
    }

    if (resp.error) {
      return;
    }

    this.users = resp.data;
    this.loginButton = false;
  }
}
