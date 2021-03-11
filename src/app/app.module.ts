import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HttpClientModule} from '@angular/common/http';
import {DataTablesModule} from 'angular-datatables';
import {authInterceptorProviders} from './_helpers/auth.interceptor';
import {AuthGuard} from './_guard/auth.guard';
import {GlobalErrorHandlerService} from './_services/global-error-handler.service';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MaterialModule} from './material/material.module';

import {RegistrationFormComponent} from './registration-form/registration-form.component';
import {UserComponent} from './user/user.component';
import {LoginFormComponent} from './login-form/login-form.component';
import {HomeComponent} from './home/home.component';
import {FooterComponent} from './footer/footer.component';
import {EventListComponent} from './event-list/event-list.component';
import {UserProfileComponent} from './user-profile/user-profile.component';
import {VisitorListComponent} from './visitor-list/visitor-list.component';
import {UserListComponent} from './user-list/user-list.component';
import {ErrorComponent} from './error/error.component';
import {EventDialogFormComponent} from './event-dialog-form/event-dialog-form.component';
import {ConfirmDialogComponent} from './confirm-dialog/confirm-dialog.component';
import {EventService} from './_services/event.service';
import {DatePipe} from '@angular/common';
import {ResponseDialogComponent} from './response-dialog/response-dialog.component';
import {UserDialogFormComponent} from './user-dialog-form/user-dialog-form.component';
import {RegistrationUnsubscribeComponent} from './registration-unsubscribe/registration-unsubscribe.component';
import {RegistrationDialogFormComponent} from './registration-dialog-form/registration-dialog-form.component';
import {UserAvatarListComponent} from './user-avatar-list/user-avatar-list.component';

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
    RegistrationUnsubscribeComponent,
    RegistrationDialogFormComponent,
    UserAvatarListComponent
  ],
  imports: [
    MaterialModule,
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    DataTablesModule,
    BrowserAnimationsModule,
    FlexLayoutModule
  ],
  providers: [authInterceptorProviders, AuthGuard, GlobalErrorHandlerService, EventService, DatePipe],
  bootstrap: [AppComponent],
})
export class AppModule { }
