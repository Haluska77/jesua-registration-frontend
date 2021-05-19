import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PasswordAccountFormComponent} from './password-account-form/password-account-form.component';
import {PasswordRoutingModule} from './password-routing.module';
import {PasswordComponent} from './password/password.component';
import {PasswordRegisterFormComponent} from './password-register-form/password-register-form.component';
import {ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from '../_module/material/material.module';


@NgModule({
  declarations: [
    PasswordAccountFormComponent,
    PasswordComponent,
    PasswordRegisterFormComponent
  ],
  imports: [
    CommonModule,
    PasswordRoutingModule,
    ReactiveFormsModule,
    MaterialModule
  ]
})

export class PasswordModule {
}
