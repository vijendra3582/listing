import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivateChild } from '@angular/router';
import { Observable } from 'rxjs';
import { TokenService } from '../services/token.service';

@Injectable({ providedIn: 'root' })
export class LoginGuard implements CanActivate, CanActivateChild {

    constructor(private tokenService: TokenService, private router: Router) {

    }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {
        return this.isLoggedIn();
    }

    canActivateChild(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {
        return this.isLoggedIn();
    }

    isLoggedIn() {
        if (this.tokenService.loggedIn) {
            this.router.navigateByUrl('/dashboard');
            return false;
        } else {
            return true;
        }
    }
}