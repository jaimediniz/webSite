import { Component, OnInit } from '@angular/core';
import { API } from 'src/app/services/backend.service';

import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  constructor(private api: API) {}

  ngOnInit(): void {}

  test(): void {
    this.api.subscribe({
      route: 'subscriptions',
      endPoint: 'addSubscription',
      publicKey: environment.publicKey,
      name: '',
      endpointURL: 'a',
      keyP256dh: 'a',
      keyAuth: 'a',
      paused: 'false',
      topics: '*'
    });
  }
}
