import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RegistrationFormComponent} from './registration/registration-form/registration-form.component';
import {EventListComponent} from './event/event-list/event-list.component';
import {HomeComponent} from './home/home.component';
import {LoginFormComponent} from './login-form/login-form.component';
import {UserProfileComponent} from './user/user-profile/user-profile.component';
import {AuthGuard} from './_guard/auth.guard';
import {UserListComponent} from './user/user-list/user-list.component';
import {VisitorListComponent} from './visitor-list/visitor-list.component';
import {ErrorComponent} from './error/error.component';
import {RegistrationUnsubscribeComponent} from './registration/registration-unsubscribe/registration-unsubscribe.component';
import {RoleGuard} from "./_guard/role.guard";

const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'registration', component: RegistrationFormComponent},
  {path: 'registration/unsubscribe', component: RegistrationUnsubscribeComponent},
  {path: 'home', component: HomeComponent},
  {path: 'events', component: EventListComponent, canActivate: [AuthGuard]},
  {path: 'login', component: LoginFormComponent},
  {path: 'profile', component: UserProfileComponent, canActivate: [AuthGuard]},
  {
    path: 'users', component: UserListComponent, canActivate: [RoleGuard],
    data: {
      entryRole: 'ROLE_ADMIN'
    }
  },
  {path: 'visitors', component: VisitorListComponent, canActivate: [AuthGuard]},
  {path: 'error', component: ErrorComponent},
  {
    path: 'password',
    loadChildren: () => import('./password/password.module').then(mod => mod.PasswordModule),
  }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {
}
