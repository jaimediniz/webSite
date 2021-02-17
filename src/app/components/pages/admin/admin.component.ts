import { Component, OnInit } from '@angular/core';
import { APIService } from 'src/app/services/backend.service';
import { User } from 'src/interfaces/database';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  public loginButton = true;
  public users: Array<User>;

  constructor(private api: APIService) {
    this.getUsers();
  }

  ngOnInit(): void {}

  async getUsers(): Promise<void> {
    this.users = await this.api.getUsers();
  }
}
