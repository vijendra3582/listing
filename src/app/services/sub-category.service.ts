import { Injectable } from "@angular/core";
import { ApiClient } from '../common/api.client';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})

export class SubCategoryService {
    constructor(private api: ApiClient) { }

    insert(data) {
        return this.api.post('sub-category/insert', data);
    }

    update(data) {
        return this.api.put('sub-category/update', data);
    }

    delete(sub_category_id) {
        return this.api.delete('sub-category/delete/' + sub_category_id);
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

        return this.api.getO('sub-category/all', params);
    }

    single(sub_category_id) {
        return this.api.get('sub-category/single/' + sub_category_id);
    }
}