import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PasswordAccountFormComponent} from './password-account-form/password-account-form.component';
import {PasswordComponent} from './password/password.component';
import {PasswordRegisterFormComponent} from './password-register-form/password-register-form.component';


const passwordRoutes: Routes = [
  { path: '', component: PasswordComponent,
    children: [
      {
        path: 'account', component: PasswordAccountFormComponent
      },
      {
        path: 'register', component: PasswordRegisterFormComponent
      },
      {
        path: 'register/:token', component: PasswordRegisterFormComponent
      }

    ] },

];

@NgModule({
  imports: [
    RouterModule.forChild(passwordRoutes)
  ],
  exports: [
    RouterModule
  ]
})

export class PasswordRoutingModule { }
