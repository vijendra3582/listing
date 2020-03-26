import { Injectable } from "@angular/core";
import { ApiClient } from '../common/api.client';

@Injectable({
    providedIn: 'root'
})

export class LocationService {
    constructor (private api: ApiClient){}

    getCountry(){
        return this.api.get('location/country');
    }

    getState(country_id){
        return this.api.get('location/state/'+country_id);
    }

    getCity(state_id){
        return this.api.get('location/city/'+state_id);
    }
}