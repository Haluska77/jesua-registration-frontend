import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {EventListComponent} from './event/event-list/event-list.component';
import {HomeComponent} from './home/home.component';
import {LoginFormComponent} from './login-form/login-form.component';
import {UserProfileComponent} from './user/user-profile/user-profile.component';
import {UserListComponent} from './user/user-list/user-list.component';
import {VisitorListComponent} from './visitor-list/visitor-list.component';
import {ErrorComponent} from './error/error.component';
import {RegistrationUnsubscribeComponent} from './registration/registration-unsubscribe/registration-unsubscribe.component';
import {NotFoundComponent} from './not-found/not-found.component';
import {ProjectListComponent} from './project/project-list/project-list.component';
import {ProjectDetailComponent} from './project/project-detail/project-detail.component';
import {FileListComponent} from './file/file-list/file-list.component';
import {AuthGuard} from './_guard/auth.guard';
import {RoleGuard} from './_guard/role.guard';
import {ProjectGuard} from './_guard/project.guard';
import { CallbackComponent } from './callback/callback.component';
import { UserRole } from './_services/login.service';

const routes: Routes = [
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'registration', component: HomeComponent},
  {path: 'registration/unsubscribe', component: RegistrationUnsubscribeComponent},
  {path: 'home', component: HomeComponent},
  {path: 'events', component: EventListComponent, canActivate: [AuthGuard]},
  {path: 'login', component: LoginFormComponent},
  {path: 'profile', component: UserProfileComponent, canActivate: [AuthGuard]},
  {path: 'users', component: UserListComponent, canActivate: [RoleGuard],
    data: {entryRole: UserRole.ROLE_ADMIN}
  },
  {path: 'visitors', component: VisitorListComponent, canActivate: [AuthGuard]},
  {path: 'projects', component: ProjectListComponent, canActivate: [AuthGuard]},
  {path: 'projects/:projectId/images', component: FileListComponent, canActivate: [AuthGuard, ProjectGuard]},
  {path: 'projects/:projectId', component: ProjectDetailComponent, canActivate: [AuthGuard, ProjectGuard]},
  {path: 'error', component: ErrorComponent},
  {path: 'password',
    loadChildren: () => import('./password/password.module').then(mod => mod.PasswordModule),
  },
  {path: 'callback', component: CallbackComponent},
  {path: '404', component: NotFoundComponent},
  {path: '**', redirectTo: '/404'}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {
}
