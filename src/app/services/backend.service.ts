import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Subject } from 'rxjs';
import { LoggerService } from './logger.service';
import {
  APIEventsResponse,
  APILoginResponse,
  APIResponse,
  APIUsersResponse
} from '../../interfaces/backend';
import { Event, User, Subscription } from '../../interfaces/database';
import { LoadingService } from './loading.service';
import { SweetAlertService } from './sweetAlert.service';
import { CookieService } from 'ngx-cookie';

@Injectable({ providedIn: 'root' })
export class APIService {
  public activeSession: Subject<string> = new Subject();
  public isAdmin = false;

  constructor(
    private logger: LoggerService,
    private http: HttpClient,
    private loading: LoadingService,
    private alert: SweetAlertService,
    private cookieService: CookieService
  ) {}

  async addSubscription(sub: PushSubscription): Promise<boolean> {
    const jsonSub = sub.toJSON();
    const payload: Subscription = {
      name: '',
      expirationTime: 'null',
      endpoint: jsonSub?.endpoint ?? '',
      p256dh: jsonSub.keys?.p256dh ?? '',
      auth: jsonSub.keys?.auth ?? '',
      paused: false,
      topics: '*'
    };

    const apiResponse = await this.post('/api/subscribe', payload);
    return !(apiResponse as any).error;
  }

  async login(payload: {
    username: string;
    password: string;
  }): Promise<boolean> {
    this.loading.startLoading();
    const apiResponse: APILoginResponse = await this.post(
      '/api/login',
      payload
    );
    console.log(apiResponse);
    this.loading.stopLoading();

    const expires = new Date();
    expires.setHours(23, 59, 59, 0);
    this.cookieService.put('Role', apiResponse?.data?.role, {
      expires
    });
    this.cookieService.put('Key', apiResponse?.data?.key, {
      expires
    });

    if (apiResponse?.error) {
      this.alert.toast('Something went wrong!', 'error', apiResponse?.message);
      return false;
    }
    this.alert.toast('Logged!', 'success', 'You are now logged.');
    return true;
  }

  async register(payload: {
    username: string;
    password: string;
    code: string;
  }): Promise<boolean> {
    this.loading.startLoading();
    const apiResponse = await this.post('/api/register', payload);
    this.loading.stopLoading();
    if (!apiResponse.error) {
      this.alert.toast('Registered!', 'success', '');
    }
    return false;
  }

  async getEvents(): Promise<Event[]> {
    const apiResponse: APIEventsResponse = await this.get('/api/events');
    this.alert.toast('Updated!', 'success', 'The list was updated!');
    return apiResponse?.data;
  }

  async getUsers(): Promise<User[]> {
    const apiResponse: APIUsersResponse = await this.get('/api/admin');
    this.alert.toast('Updated!', 'success', 'The list was updated!');
    return apiResponse?.data;
  }

  async addEvent(payload: {
    username: string;
    password: string;
    code: string;
  }): Promise<boolean> {
    this.loading.startLoading();
    const apiResponse = await this.post('/api/events', payload);
    this.loading.stopLoading();
    if (!apiResponse.error) {
      this.alert.toast('Add it!', 'success', '');
    }
    return false;
  }

  async get(route: string): Promise<APIResponse> {
    try {
      const requestOptions = {
        headers: new HttpHeaders({
          authorization: this.cookieService.get('Key') ?? ''
        }),
        withCredentials: true
      };
      const response = await this.http
        .get<Promise<APIResponse>>(route, requestOptions)
        .toPromise();
      this.logger.log('Response', response);
      return response;
    } catch (error) {
      const response: APIResponse = error.error;
      this.logger.error('BACKEND - GET - ERROR', response);
      return response;
    }
  }

  async post(route: string, payload: any): Promise<APIResponse> {
    this.logger.log('Payload', payload);
    try {
      const requestOptions = {
        headers: new HttpHeaders({
          authorization: this.cookieService.get('Key') ?? ''
        }),
        withCredentials: true
      };
      const response = await this.http
        .post<Promise<APIResponse>>(
          route,
          JSON.stringify(payload),
          requestOptions
        )
        .toPromise();
      this.logger.log('Response', response);
      return response;
    } catch (error) {
      const response: APIResponse = error.error;
      this.logger.error('BACKEND - POST - ERROR', error.error);
      return response;
    }
  }
}
