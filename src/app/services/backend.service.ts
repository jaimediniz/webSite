import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Subject } from 'rxjs';
import { LoggerService } from './logger.service';
import {
  APIEventsResponse,
  APILoginResponse,
  APIResponse
} from '../../interfaces/backend';
import { Event, Subscription } from '../../interfaces/database';
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
    const payLoad: Subscription = {
      name: '',
      expirationTime: 'null',
      endpoint: jsonSub?.endpoint ?? '',
      p256dh: jsonSub.keys?.p256dh ?? '',
      auth: jsonSub.keys?.auth ?? '',
      paused: false,
      topics: '*'
    };

    const apiResponse = await this.post('/api/subscribe', payLoad);
    return !(apiResponse as any).error;
  }

  async login(payLoad: {
    username: string;
    password: string;
  }): Promise<boolean> {
    this.loading.startLoading();
    const apiResponse: APILoginResponse = await this.post(
      '/api/login',
      payLoad
    );
    this.loading.stopLoading();

    const expires = new Date();
    expires.setHours(23, 59, 59, 0);
    this.cookieService.put('Role', apiResponse.data.role, {
      expires
    });
    this.cookieService.put('Key', apiResponse.data.key, {
      expires
    });

    if (apiResponse.error) {
      this.alert.toast('Something went wrong!', 'error', apiResponse.message);
      return false;
    }
    this.alert.toast('Logged!', 'success', 'You are now logged.');
    return true;
  }

  async register(payLoad: {
    username: string;
    password: string;
    code: string;
  }): Promise<boolean> {
    this.loading.startLoading();
    const apiResponse = await this.post('/api/register', payLoad);
    this.loading.stopLoading();
    if (!apiResponse.error) {
      this.alert.toast('Registered!', 'success', '');
    }
    return false;
  }

  async getEvents(): Promise<Array<Event>> {
    const apiResponse: APIEventsResponse = await this.get('/api/events');
    this.alert.toast('Updated!', 'success', 'The list was updated!');
    return apiResponse.data;
  }

  async addEvent(payLoad: {
    username: string;
    password: string;
    code: string;
  }): Promise<boolean> {
    this.loading.startLoading();
    const apiResponse = await this.post('/api/events', payLoad);
    this.loading.stopLoading();
    if (!apiResponse.error) {
      this.alert.toast('Add it!', 'success', '');
    }
    return false;
  }

  async get(route: string): Promise<APIResponse> {
    try {
      const response = await this.http
        .get<Promise<APIResponse>>(route)
        .toPromise();
      this.logger.log('Response', response);
      return response;
    } catch (error) {
      const response: APIResponse = error.error;
      this.logger.error('BACKEND - GET - ERROR', response);
      return response;
    }
  }

  async post(route: string, payLoad: any): Promise<APIResponse> {
    this.logger.log('Payload', payLoad);
    try {
      const response = await this.http
        .post<Promise<APIResponse>>(route, JSON.stringify(payLoad))
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
