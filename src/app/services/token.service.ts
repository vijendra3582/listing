import { Injectable } from '@angular/core';
import { ApiClient } from '../common/api.client';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class TokenService {

    loggedIn = false;
    afterLogin = new Subject();
    userInfo:any = {};

    private iss = {
        login: this.api.getUrl('login'),
        signup: this.api.getUrl('register')
    };

    constructor(private api: ApiClient) { 
        this.restoreInfo();
    }


    setUserInfo(userInfo) {
        this.loggedIn = true;
        this.userInfo = userInfo;
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        this.afterLogin.next();
    }

    restoreInfo(){
        let data = localStorage.getItem('userInfo');
        if(data){
            this.userInfo = JSON.parse(data);
            this.loggedIn = true;
            this.afterLogin.next();
        }
    }

    logout() {
        this.loggedIn = false;
        localStorage.removeItem('userInfo');
        this.afterLogin.next();
    }

    getToken() {
        return this.userInfo ? this.userInfo.token: '';
    }

    hasToken() {
        return this.getToken() !== null;
    }
}