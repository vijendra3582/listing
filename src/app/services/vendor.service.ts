import { Injectable } from "@angular/core";
import { ApiClient } from '../common/api.client';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})

export class VendorService {
    constructor(private api: ApiClient) { }

    insert(data) {
        return this.api.post('vendor/insert', data);
    }

    update(data) {
        return this.api.put('vendor/update', data);
    }

    delete(vendor_id) {
        return this.api.delete('vendor/delete/' + vendor_id);
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

        return this.api.getO('vendor/all', params);
    }

    single(vendor_id) {
        return this.api.get('vendor/single/' + vendor_id);
    }
}