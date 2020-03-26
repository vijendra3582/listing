import { Injectable } from "@angular/core";
import { ApiClient } from '../common/api.client';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})

export class ProductService {
    constructor(private api: ApiClient) { }

    insert(data) {
        return this.api.post('product/insert', data);
    }

    import(data) {
        return this.api.post('product/import', data);
    }

    importProductData(data) {
        return this.api.post('product/importProduct', data);
    }

    update(data) {
        return this.api.put('product/update', data);
    }

    delete(product_id) {
        return this.api.delete('product/delete/' + product_id);
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

        return this.api.getO('product/all', params);
    }

    single(product_id) {
        return this.api.get('product/single/' + product_id);
    }
    
    changeFeatured(data){
        return this.api.put('product/changeFeatured', data);
    }
    
    changeStatus(data){
        return this.api.put('product/changeStatus', data);
    }
    
    changeStock(data){
        return this.api.put('product/changeStock', data);
    }
    
    changeDiscount(data){
        return this.api.put('product/changeDiscount', data);
    }
    
    changeTax(data){
        return this.api.put('product/changeTax', data);
    }
}