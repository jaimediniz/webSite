import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot
} from '@angular/router';
import { CookieService } from 'ngx-cookie';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private cookieService: CookieService) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (this.cookieService.get('Role') !== 'admin') {
      // redirect to login page
      return false;
    }
    return true;
  }
}
