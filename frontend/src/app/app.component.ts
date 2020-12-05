import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { API, Message } from './services/backend.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'frontend';
  public messages: Array<Message> = [];
  public isUserLoggedIn: string = '';
  public isAdmin: boolean = false;
  private isUserLoggedInSubscription: Subscription = new Subscription();

  public ReverseSortOrder = false;

  constructor(public api: API) {
    this.isUserLoggedInSubscription = this.api.activeSession.subscribe(
      (username) => {
        this.isUserLoggedIn = username;
        if (username != '') {
          this.successfulLogin();
        } else {
          this.successfulLogoff();
        }
      }
    );
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.isUserLoggedInSubscription.unsubscribe();
  }

  fakeLogin() {
    this.login({ username: 'jaime', password: '123' });
  }

  async login(jsonData: {
    username: string;
    password: string;
  }): Promise<boolean> {
    return this.api.login({
      username: jsonData.username,
      password: jsonData.password
    });
  }

  async logoff() {
    this.api.logoff();
  }

  async successfulLogin(): Promise<void> {
    this.isAdmin = this.api.isAdmin;
    this.getMessages();
  }

  async successfulLogoff() {
    this.isAdmin = false;
    this.messages = this.messages.filter((message) => message[4] === true);
  }

  async deleteMessage(messageID: number) {
    const success = await this.api.deleteMessage(messageID);
    if (success) {
      this.messages = this.messages.filter(
        (message) => message[0] != messageID
      );
    }
  }

  async postMessage(jsonData: { message: string; isPublic: boolean }) {
    const data = await this.api.postMessage(jsonData);
    if (data) {
      this.messages.push(data.messageArray);
    }
  }

  async getMessages(): Promise<void> {
    const data: { messages: Array<Message> } = await this.api.fetchData({
      route: 'messages',
      endPoint: 'getMessages'
    });
    this.messages = data.messages.filter((message) => message[0]);
    console.log(this.messages);
  }
}
