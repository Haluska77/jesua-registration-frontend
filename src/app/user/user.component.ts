import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from '../custom-validators';

import { LoginService } from '../_services/login.service';

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

  emailPattern = new RegExp("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$");
  passwordDigitPattern = new RegExp("[0-9]");
  passwordLowerCasePattern = new RegExp("[a-z]");
  passwordUpperCasePattern = new RegExp("[A-Z]");

  ngOnInit() {
    this.authService.userForm().subscribe(
      data => {
        this.isAuthorized = true;
      },
      err => {
        this.errorMessage = err.message;
        this.isAuthorized = false;
        console.log(err.message);
      }
    );

    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required,
      CustomValidators.patternValidator(this.emailPattern, { emailValid: true })]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        CustomValidators.patternValidator(this.passwordDigitPattern, { hasNumber: true }),
        CustomValidators.patternValidator(this.passwordLowerCasePattern, { hasSmallChars: true }),
        CustomValidators.patternValidator(this.passwordUpperCasePattern, { hasBigChars: true })
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
