import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  private users = [];
  constructor() {
    this.getUsers();
  }

  ngOnInit(): void {}

  getUsers(): void {
    const dbUsers: any = [];

    this.users = dbUsers;
  }

  addUser(): void {}
}
