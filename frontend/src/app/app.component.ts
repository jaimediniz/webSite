import { Component } from '@angular/core';
import { API } from './services/backend.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'frontend';
  public messages: Array<Array<number | string>> = [];

  constructor(public api: API) {}

  ngOnInit() {
    const waitForLogin = this.api.activeSession.subscribe(() => {
      this.getMessages();
      waitForLogin.unsubscribe();
    });
  }

  async getMessages(): Promise<void> {
    const data = await this.api.fetchData({
      route: 'messages',
      endPoint: 'getMessages'
    });
    this.messages = data.messages.filter(
      (message: Array<number | string>) => message[0] != ''
    );
    console.log(this.messages);
  }
}
