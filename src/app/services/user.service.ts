import { Injectable } from "@angular/core";
import { ApiClient } from '../common/api.client';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})

export class UserService {
    constructor(private api: ApiClient) { }

    insert(data) {
        return this.api.post('user/insert', data);
    }

    update(data) {
        return this.api.put('user/update', data);
    }

    delete(user_id) {
        return this.api.delete('user/delete/' + user_id);
    }

    all(
        pageIndex: number = 1,
        pageSize: number = 10,
        sortField: string,
        sortOrder: string,
        search: object
    ): Observable<any> {
        let params = new HttpParams()
            .append('page', `${pageIndex}`)
            .append('results', `${pageSize}`)
            .append('sortField', sortField)
            .append('sortOrder', sortOrder);

        Object.keys(search).forEach(function (key) {
            params = params.append(key, search[key]);
        });

        return this.api.getO('user/all', params);
    }

    single(user_id) {
        return this.api.get('user/single/' + user_id);
    }
}