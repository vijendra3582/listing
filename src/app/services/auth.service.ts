import { Injectable } from '@angular/core';
import { ApiClient } from '../common/api.client';
import { TokenService } from './../services/token.service';

@Injectable({
    providedIn: 'root'
})

export class AuthService {
    constructor(private api: ApiClient, private tokenService: TokenService) { }

    login(data, type) {
        return this.api.post('auth/' + type + '/login', data);
    }

    register(data) {
        return this.api.post('auth/vendor/register', data);
    }

    registerUser(data) {
        return this.api.post('auth/customer/register', data);
    }

    resendVerification(data) {
        return this.api.post('auth/vendor/resend-verification', data);
    }

    verifyUser(data) {
        return this.api.post('auth/vendor/verify-user', data);
    }

    forgotPassword(data) {
        return this.api.post('auth/vendor/forgot-password', data);
    }

    resetPassword(data) {
        return this.api.post('auth/vendor/reset-password', data);
    }

    logout() {
        this.tokenService.logout();
    }
}