import { Injectable } from '@angular/core';
import { ApiClient } from '../common/api.client';
import { TokenService } from './../services/token.service';

@Injectable({
    providedIn: 'root'
})

export class AuthService {
    constructor(private api: ApiClient, private tokenService: TokenService) { }

    login(data) {
        return this.api.post('auth/login', data);
    }

    register(data) {
        return this.api.post('auth/register', data);
    }

    resendVerification(data) {
        return this.api.post('auth/resend-verification', data);
    }

    verifyUser(data) {
        return this.api.post('auth/verify-user', data);
    }

    forgotPassword(data) {
        return this.api.post('auth/forgot-password', data);
    }

    resetPassword(data) {
        return this.api.post('auth/reset-password', data);
    }
    
    logout(){
        this.tokenService.logout();
    }
}