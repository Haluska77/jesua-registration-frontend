import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CustomValidators} from '../custom-validators';

import {LoginService} from '../_services/login.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  submitted = false;
  userForm: FormGroup;
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';
  isAuthorized = false;

  constructor(private authService: LoginService,
  private fb: FormBuilder) { }


  get f() { return this.userForm.controls; }


  ngOnInit() {

    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required,
      CustomValidators.validateEmailPattern()]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        CustomValidators.containsAtLeastOneNumber(),
        CustomValidators.containsAtLeastOneSmallChar(),
        CustomValidators.containsAtLeastOneBigChar()
      ]],
      confirmPassword: ['', [Validators.required]],
      role: ['', [Validators.required]]
    }, {
      validator: CustomValidators.mustMatch('password', 'confirmPassword')
    });
  }

  signup() {
    this.submitted = true;
   this.authService.signUp(this.userForm.value).subscribe(
      data => {
        this.isSuccessful = true;
        this.isSignUpFailed = false;
      },
      err => {
        this.errorMessage = err.error;
        console.log("ERROR "+err.error);
        this.isSignUpFailed = true;
      }
    );
  }
}
