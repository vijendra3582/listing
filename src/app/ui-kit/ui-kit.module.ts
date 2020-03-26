import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConstantsService } from './../services/constants.service';
import { uiComponents } from './components';
import { ANT_DESIGN } from './ant-design.module';
import { NZ_I18N, en_US } from 'ng-zorro-antd/i18n';

@NgModule({
    declarations: [
        ...uiComponents
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule
    ],
    exports: [
        ...uiComponents,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ANT_DESIGN
    ],
    providers: [
        ConstantsService,
        { provide: NZ_I18N, useValue: en_US }
    ],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
})
export class UIKitModule { }