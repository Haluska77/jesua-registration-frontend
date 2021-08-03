import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HttpClientModule} from '@angular/common/http';
import {DataTablesModule} from 'angular-datatables';
import {authInterceptorProviders} from './_helpers/auth.interceptor';
import {AuthGuard} from './_guard/auth.guard';
import {GlobalErrorHandlerService} from './_services/global-error-handler.service';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MaterialModule} from './_module/material/material.module';

import {LoginFormComponent} from './login-form/login-form.component';
import {HomeComponent} from './home/home.component';
import {FooterComponent} from './footer/footer.component';
import {EventListComponent} from './event/event-list/event-list.component';
import {UserProfileComponent} from './user/user-profile/user-profile.component';
import {VisitorListComponent} from './visitor-list/visitor-list.component';
import {UserListComponent} from './user/user-list/user-list.component';
import {ErrorComponent} from './error/error.component';
import {EventDialogFormComponent} from './event/event-dialog-form/event-dialog-form.component';
import {ConfirmDialogComponent} from './_dialog/confirm-dialog/confirm-dialog.component';
import {EventService} from './_services/event.service';
import {DatePipe} from '@angular/common';
import {ResponseDialogComponent} from './_dialog/response-dialog/response-dialog.component';
import {UserDialogFormComponent} from './user/user-dialog-form/user-dialog-form.component';
import {RegistrationUnsubscribeComponent} from './registration/registration-unsubscribe/registration-unsubscribe.component';
import {RegistrationDialogFormComponent} from './registration/registration-dialog-form/registration-dialog-form.component';
import {UserAvatarListComponent} from './user/user-avatar-list/user-avatar-list.component';
import {HeaderComponent} from './header/header.component';
import {NotFoundComponent} from './not-found/not-found.component';
import {EventStatsCardComponent} from './event/event-stats-card/event-stats-card.component';
import {UserDetailCardComponent} from './user/user-detail-card/user-detail-card.component';
import {GdprDialogComponent} from './_dialog/gdpr-dialog/gdpr-dialog.component';
import {EventImageListComponent} from './event/event-image-list/event-image-list.component';
import {ProjectDialogFormComponent} from './project/project-dialog-form/project-dialog-form.component';
import {EventFilterPipe} from './_pipe/event-filter.pipe';
import {UploadFileComponent} from './file/upload-file/upload-file.component';
import {FileListComponent} from './file/file-list/file-list.component';
import {ProjectListComponent} from './project/project-list/project-list.component';
import {ProjectDetailComponent} from './project/project-detail/project-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    FooterComponent,
    EventListComponent,
    LoginFormComponent,
    UserProfileComponent,
    VisitorListComponent,
    UserListComponent,
    ErrorComponent,
    EventDialogFormComponent,
    ConfirmDialogComponent,
    ResponseDialogComponent,
    UserDialogFormComponent,
    RegistrationUnsubscribeComponent,
    RegistrationDialogFormComponent,
    UserAvatarListComponent,
    HeaderComponent,
    NotFoundComponent,
    EventStatsCardComponent,
    UserDetailCardComponent,
    GdprDialogComponent,
    EventImageListComponent,
    ProjectDialogFormComponent,
    EventFilterPipe,
    UploadFileComponent,
    FileListComponent,
    ProjectListComponent,
    ProjectDetailComponent
  ],
    imports: [
        MaterialModule,
        BrowserModule,
        AppRoutingModule,
        ReactiveFormsModule,
        HttpClientModule,
        DataTablesModule,
        BrowserAnimationsModule,
        FlexLayoutModule,
        FormsModule
    ],
  providers: [authInterceptorProviders, AuthGuard, GlobalErrorHandlerService, EventService, DatePipe],
  bootstrap: [AppComponent],
})
export class AppModule { }
