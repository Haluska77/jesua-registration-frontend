import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {RegistrationFormComponent} from './registration-form/registration-form.component';
import {HttpClientModule} from '@angular/common/http';
import {HomeComponent} from './home/home.component';
import {FooterComponent} from './footer/footer.component';
import {EventListComponent} from './event-list/event-list.component';
import {DataTablesModule} from 'angular-datatables';
import {LoginFormComponent} from './login-form/login-form.component';
import {authInterceptorProviders} from './_helpers/auth.interceptor';
import {UserProfileComponent} from './user-profile/user-profile.component';
import {UserComponent} from './user/user.component';
import {AuthGuard} from './_guard/auth.guard';
import {VisitorListComponent} from './visitor-list/visitor-list.component';
import {UserListComponent} from './user-list/user-list.component';
import {GlobalErrorHandlerService} from './_services/global-error-handler.service';
import {ErrorComponent} from './error/error.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgxChartsModule} from '@swimlane/ngx-charts';

import {MaterialModule} from './material/material.module';
import {EventDialogFormComponent} from './event-dialog-form/event-dialog-form.component';
import {ConfirmDialogComponent} from './confirm-dialog/confirm-dialog.component';
import {EventService} from './_services/event.service';
import {DatePipe} from '@angular/common';
import {ResponseDialogComponent} from './response-dialog/response-dialog.component';
import {UserDialogFormComponent} from './user-dialog-form/user-dialog-form.component';
import {RegistrationUnsubscribeComponent} from './registration-unsubscribe/registration-unsubscribe.component';

@NgModule({
  declarations: [
    AppComponent,
    RegistrationFormComponent,
    HomeComponent,
    FooterComponent,
    EventListComponent,
    LoginFormComponent,
    UserProfileComponent,
    UserComponent,
    VisitorListComponent,
    UserListComponent,
    ErrorComponent,
    EventDialogFormComponent,
    ConfirmDialogComponent,
    ResponseDialogComponent,
    UserDialogFormComponent,
    RegistrationUnsubscribeComponent
  ],
    imports: [
        MaterialModule,
        BrowserModule,
        AppRoutingModule,
        ReactiveFormsModule,
        HttpClientModule,
        DataTablesModule,
        BrowserAnimationsModule,
      NgxChartsModule
    ],
  providers: [authInterceptorProviders, AuthGuard, GlobalErrorHandlerService, EventService, DatePipe],
  bootstrap: [AppComponent],
})
export class AppModule { }
