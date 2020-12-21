import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { Subject } from 'rxjs';
export interface ApiResponse {
  code: number;
  error: boolean;
  message: string;
  data: any;
}
export interface Message extends Array<string | number | boolean> {
  0: number;
  1: string;
  2: string;
  3: string;
  4: boolean;
}

@Injectable({ providedIn: 'root' })
export class API {
  public activeSession: Subject<string> = new Subject();
  private token = '';
  private tokenRow = 1;
  public isAdmin = false;

  constructor(private http: HttpClient) {}

  async login(jsonData: {
    username: string;
    password: string;
  }): Promise<boolean> {
    const payLoad = {
      ...jsonData,
      route: 'login',
      publicKey: environment.publicKey
    };

    const apiResponse = await this.post(payLoad);
    if (apiResponse.code != 200) {
      return false;
    }

    console.log('Login was a success!');

    this.token = apiResponse.data.token;
    this.tokenRow = apiResponse.data.tokenRow;
    this.isAdmin = apiResponse.data.isAdmin;
    this.activeSession.next(jsonData.username);
    return true;
  }

  async logoff(): Promise<boolean> {
    this.activeSession.next('');
    //TODO: send message to server to logout, or not, just leave old token!
    return true;
  }

  async fetchData(jsonData: any): Promise<ApiResponse | any> {
    const payLoad = {
      ...jsonData,
      publicKey: environment.publicKey,
      token: this.token,
      tokenRow: this.tokenRow
    };

    const apiResponse = await this.post(payLoad);
    if (apiResponse.code != 200) {
      return {};
    }

    return apiResponse.data;
  }

  async postMessage(jsonData: {
    message: string;
    isPublic: boolean;
  }): Promise<any> {
    const payLoad = {
      ...jsonData,
      route: 'messages',
      endPoint: 'createMessage',
      publicKey: environment.publicKey,
      token: this.token,
      tokenRow: this.tokenRow
    };

    const apiResponse = await this.post(payLoad);
    if (apiResponse.code != 201) {
      return {};
    }

    return apiResponse.data;
  }

  async deleteMessage(messageID: number): Promise<boolean> {
    const payLoad = {
      messageId: messageID,
      route: 'messages',
      endPoint: 'deleteMessage',
      publicKey: environment.publicKey,
      token: this.token,
      tokenRow: this.tokenRow
    };

    const apiResponse = await this.post(payLoad);
    if (apiResponse.code != 200) {
      return false;
    }

    return true;
  }

  async addSubscription(sub: PushSubscription): Promise<boolean> {
    const JSONSub = sub.toJSON();
    const payLoad = {
      route: 'subscriptions',
      endPoint: 'addSubscription',
      publicKey: environment.publicKey,
      name: 'Jaime',
      endpointURL: JSONSub.endpoint,
      p256dh: JSONSub.keys?.p256dh,
      auth: JSONSub.keys?.auth
    };
    const apiResponse = await this.subscribe(payLoad);
    if (apiResponse.code != 200) {
      return false;
    }

    return true;
  }

  async subscribe(payLoad: any): Promise<any> {
    console.log(payLoad);
    try {
      return {
        code: 200,
        data: {},
        error: false,
        message: ''
      };
    } catch (e) {
      console.error(e);
      return {
        code: 500,
        data: {},
        error: true,
        message: 'Something is wrong!'
      };
    }
  }

  async post(payLoad: any): Promise<ApiResponse> {
    console.log(payLoad);
    try {
      const apiResponse = await this.http
        .post<ApiResponse>(environment.baseUrl, JSON.stringify(payLoad))
        .toPromise();
      console.log(apiResponse);
      return apiResponse;
    } catch (e) {
      console.error(e);
      return {
        code: 500,
        data: {},
        error: true,
        message: 'Something is wrong!'
      };
    }
  }
}
