import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Subject } from 'rxjs';
import { LoggerService } from './logger.service';
import { APIResponse, Subscription } from '../shared/interfaces';
import { LoadingService } from './loading.service';

@Injectable({ providedIn: 'root' })
export class API {
  public activeSession: Subject<string> = new Subject();
  public isAdmin = false;

  private internalError: APIResponse = {
    statusCode: 500,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      code: 500,
      data: {},
      error: true,
      message: 'Something is wrong!'
    })
  };

  constructor(
    private logger: LoggerService,
    private http: HttpClient,
    private loading: LoadingService
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
