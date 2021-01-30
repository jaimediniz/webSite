import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Subject } from 'rxjs';
import { LoggerService } from './logger.service';
import { APIResponse, Subscription } from '../interfaces/interfaces';
import { LoadingService } from './loading.service';
import { SweetAlertService } from './sweetAlert.service';

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
    })
  };

  constructor(
    private logger: LoggerService,
    private http: HttpClient,
    private loading: LoadingService,
    private alert: SweetAlertService
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
    const apiResponse = await this.post('/api/login', payLoad);
    this.loading.stopLoading();
    if (!(apiResponse as any).error) {
      this.alert.toast('Success!', 'success');
    }
    return false;
  }

  async register(payLoad: {
    username: string;
    password: string;
    code: string;
  }): Promise<boolean> {
    this.loading.startLoading();
    const apiResponse = await this.post('/api/register', payLoad);
    this.loading.stopLoading();
    if (!(apiResponse as any).error) {
      this.alert.toast('Registered!', 'success');
    }
    return false;
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
      this.logger.error(error.message);
      return this.internalError;
    }
  }
}
