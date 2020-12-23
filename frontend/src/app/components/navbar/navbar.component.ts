import { Component, OnInit } from '@angular/core';
import { API } from 'src/app/services/backend.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  constructor(private api: API) {}

  ngOnInit(): void {}

  test() {
    this.api.login({ username: 'jaime', password: '123' });
  }
}
