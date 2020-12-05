import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { Subject } from 'rxjs';

export interface ApiResponse {
  code: number;
  error: boolean;
  message: string;
  data: any;
}

@Injectable({ providedIn: 'root' })
export class API {
  public activeSession = new Subject();
  private token = '';
  private tokenRow = 1;

  constructor(private http: HttpClient) {
    this.login({ username: 'jaime', password: '123' });
  }

  async login(jsonData: { username: string; password: string }): Promise<void> {
    const payLoad = {
      ...jsonData,
      route: 'login',
      publicKey: environment.publicKey
    };

    var apiResponse;

    try {
      apiResponse = await this.http
        .post<ApiResponse>(environment.baseUrl, JSON.stringify(payLoad))
        .toPromise();
    } catch (e) {
      console.log(e);
      return;
    }

    console.log(apiResponse);

    if (apiResponse.code != 200) {
      return;
    }

    console.log('Login was a success!');

    this.token = apiResponse.data.token;
    this.tokenRow = apiResponse.data.tokenRow;
    this.activeSession.next(this.token);
  }

  async fetchData(jsonData: any): Promise<ApiResponse | any> {
    const payLoad = {
      ...jsonData,
      publicKey: environment.publicKey,
      token: this.token,
      tokenRow: this.tokenRow
    };

    console.log(payLoad);

    var apiResponse;

    try {
      apiResponse = await this.http
        .post<ApiResponse>(environment.baseUrl, JSON.stringify(payLoad))
        .toPromise();
    } catch (e) {
      console.log(e);
      return {};
    }

    console.log(apiResponse);

    if (apiResponse.code != 200) {
      return {};
    }

    return apiResponse.data;
  }
}
