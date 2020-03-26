import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { LoaderInterceptor } from './interceptors/loader.interceptor';
import { UIKitModule } from './ui-kit/ui-kit.module';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { adminRoutes } from './admin/admin.routing';
import { adminComponents } from './admin/pages';

registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
    ...adminComponents
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    UIKitModule,
    RouterModule.forRoot(adminRoutes),
    FormsModule,
    BrowserAnimationsModule 
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
