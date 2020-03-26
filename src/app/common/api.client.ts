import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface ApiResponse {
    data: any;
    status: boolean;
}

@Injectable({ providedIn: 'root' })
export class ApiClient {

    constructor(private http: HttpClient) { }

    public get(segment) {
        return this.http.get<any>(this.getUrl(segment));
    }

    public getO(segment, params) {
        return this.http.get<any>(this.getUrl(segment), { params });
    }

    public post(segment, payload) {
        return this.http.post<any>(this.getUrl(segment), payload);
    }

    public put(segment, payload) {
        return this.http.put<any>(this.getUrl(segment), payload);
    }

    public delete(segment) {
        return this.http.delete<any>(this.getUrl(segment));
    }

    public getUrl(segment) {
        return environment.apiPath + segment;
    }
}