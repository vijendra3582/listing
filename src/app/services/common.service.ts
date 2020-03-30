import { Injectable } from '@angular/core';
import { ApiClient } from '../common/api.client';

@Injectable({
    providedIn: 'root'
})

export class CommonService {
    constructor(private api: ApiClient) { }

    dropdown(type, where) {
        return this.api.get('common/dropdown/' + type + '?' + where);
    }

    upload(body) {
        return this.api.post('common/upload', body);
    }

    uploadDocument(body) {
        return this.api.post('common/uploadDocument', body);
    }

    removeImage(image) {
        return this.api.post('common/removeImage', image);
    }

    removeDocument(image) {
        return this.api.post('common/removeDocument', image);
    }

}