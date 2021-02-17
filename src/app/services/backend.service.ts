import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Subject } from 'rxjs';
import { LoggerService } from './logger.service';
import { APILoginResponse, APIResponse } from '../../interfaces/backend';
import { Event, Subscription } from '../../interfaces/database';
import { LoadingService } from './loading.service';
import { SweetAlertService } from './sweetAlert.service';
import { CookieService } from 'ngx-cookie';

@Injectable({ providedIn: 'root' })
export class APIService {
  public activeSession: Subject<string> = new Subject();
  public isAdmin = false;

  private internalError: APIResponse = {
    error: true,
    message: JSON.stringify({
      code: 500,
      data: {},
      error: true,
      message: 'Something is wrong!'
    }),
    data: ''
  };

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

    if (apiResponse.error) {
      return false;
    }

    this.alert.toast('Logged!', 'success', 'You are now logged.');
    const expires = new Date();
    expires.setHours(23, 59, 59, 0);
    this.cookieService.put('Admin', apiResponse.message, {
      expires
    });
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
    const apiResponse = (await this.get('/api/events')) as Array<Event>;
    this.alert.toast('Updated!', 'success', 'The list was updated!');
    return apiResponse;
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

  async post(route: string, payLoad: any): Promise<any> {
    this.logger.log('Payload', payLoad);
    try {
      const response = await this.http
        .post<Promise<APIResponse>>(route, JSON.stringify(payLoad))
        .toPromise();
      this.logger.log('Response', response);
      return response;
    } catch (error) {
      this.logger.error(error.message);
      return this.internalError;
    }
  }

  async get(route: string): Promise<any> {
    try {
      const response = await this.http
        .get<Promise<APIResponse>>(route)
        .toPromise();
      this.logger.log('Response', response);
      return response;
    } catch (error) {
      this.logger.error(error.message);
      return [];
    }
  }
}
