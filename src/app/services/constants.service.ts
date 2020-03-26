import { Injectable } from '@angular/core';

@Injectable()
export class ConstantsService{
    readonly AppUrl: string = 'http://localhost:4200/';
    readonly AppName: string = 'Directory Listing';
}