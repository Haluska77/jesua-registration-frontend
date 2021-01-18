import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegistrationFormComponent } from './registration-form/registration-form.component';
import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './home/home.component';
import { FooterComponent } from './footer/footer.component';
import { EventFormComponent } from './event-form/event-form.component';
import { EventListComponent } from './event-list/event-list.component';
import { DataTablesModule } from 'angular-datatables';
import { LoginFormComponent } from './login-form/login-form.component';
import { authInterceptorProviders } from './_helpers/auth.interceptor';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserComponent } from './user/user.component';
import { AuthGuard } from './_guard/auth.guard';
import { VisitorListComponent } from './visitor-list/visitor-list.component';
import { UserListComponent } from './user-list/user-list.component';
import { GlobalErrorHandlerService } from './_services/global-error-handler.service';
import { ErrorComponent } from './error/error.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@NgModule({
  declarations: [
    AppComponent,
    RegistrationFormComponent,
    HomeComponent,
    FooterComponent,
    EventFormComponent,
    EventListComponent,
    LoginFormComponent,
    UserProfileComponent,
    UserComponent,
    VisitorListComponent,
    UserListComponent,
    ErrorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    DataTablesModule,
    BrowserAnimationsModule,
    MatProgressSpinnerModule,
  ],
  providers: [authInterceptorProviders, AuthGuard, GlobalErrorHandlerService],
  bootstrap: [AppComponent]
})
export class AppModule { }
