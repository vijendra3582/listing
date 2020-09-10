import { Injectable } from "@angular/core";
import { ApiClient } from '../common/api.client';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})

export class OrderService {
    constructor(private api: ApiClient) { }

    insert(data) {
        return this.api.post('order/insert', data);
    }

    update(data) {
        return this.api.put('order/update', data);
    }

    delete(order_id) {
        return this.api.delete('order/delete/' + order_id);
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

        return this.api.getO('order/all', params);
    }

    single(order_id) {
        return this.api.get('order/single/' + order_id);
    }
}