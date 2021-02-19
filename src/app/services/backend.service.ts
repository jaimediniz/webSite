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

  async login(payload: {
    username: string;
    password: string;
  }): Promise<boolean> {
    this.loading.startLoading();
    const apiResponse: APILoginResponse = await this.post(
      '/api/login',
      payload
    );
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

  // Get Information from DB
  async getData(type: string, endpoint: string, ...query: string[]) {
    const now = new Date();
    const previous = new Date(localStorage?.getItem(type + '_time') || '');
    // milliseconds * seconds * minutes * hours
    if (now.getTime() - previous.getTime() < 1000 * 60 * 60 * 1) {
      return JSON.parse(localStorage?.getItem(type) || 'null');
    }

    const queryParams = query.length > 0 ? '?' + query.join('&') : '';
    const apiResponse: APIEventsResponse = await this.get(
      '/api/' + endpoint + queryParams
    );

    const data = apiResponse?.data;

    if (data) {
      localStorage.setItem(type, JSON.stringify(data));
      localStorage.setItem(type + '_time', `${new Date()}`);
      this.alert.toast('Updated!', 'success', 'The list was updated!');
      return data;
    }
  }

  async cacheThis(data: any, type: string) {
    const localData = JSON.parse(localStorage?.getItem(type) || 'null');
    localData.push(data);
    localStorage.setItem(type, JSON.stringify(localData));
  }

  async removeFromCache(element: any, type: string) {
    const localData = JSON.parse(localStorage?.getItem(type) || 'null');
    // eslint-disable-next-line no-underscore-dangle
    const index = localData.findIndex((x: any) => x._id === element._id);
    localData.splice(index, 1);
    localStorage.setItem(type, JSON.stringify(localData));
  }

  async getEvents(): Promise<Event[]> {
    const data = await this.getData('Events', 'events');
    return data;
  }

  async getUsers(): Promise<User[]> {
    const data = await this.getData('Users', 'admin', 'collection=Users');
    return data;
  }

  // Modify DB
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

  async insertElement(element: any, collection: string): Promise<any> {
    this.loading.startLoading();
    const apiResponse = await this.post(
      `/api/admin?collection=${collection}&action=insert`,
      element
    );
    this.loading.stopLoading();
    console.log(apiResponse);
    if (!apiResponse.error) {
      this.alert.toast('Add it!', 'success', '');
      return apiResponse.data;
    }
    return;
  }

  async deleteElement(element: any, collection: string): Promise<any> {
    console.log(element);
    this.loading.startLoading();
    const apiResponse = await this.post(
      `/api/admin?collection=${collection}&action=delete`,
      // eslint-disable-next-line no-underscore-dangle
      { _id: element._id }
    );
    this.loading.stopLoading();
    console.log(apiResponse);
    if (!apiResponse.error) {
      this.alert.toast('Deleted!', 'success', '');
      return apiResponse.data;
    }
    return;
  }

  // Low level functions
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
