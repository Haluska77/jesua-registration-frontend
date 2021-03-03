import {Injectable} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {CustomValidators} from '../custom-validators';

@Injectable({
  providedIn: 'root'
})

export class PasswordService {

  constructor(private http: HttpClient,
              private formBuilder: FormBuilder) { }

  private baseUrl = environment.baseUrl + 'password/';

  passwordAccountForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      CustomValidators.validateEmailPattern()])
  });


  passwordResetForm = this.formBuilder.group({
    token: ['', ],
    newPassword: ['', [
      Validators.required,
      Validators.minLength(8),
      CustomValidators.containsAtLeastOneNumber()]],
    confirmPassword: ['', [
      Validators.required]]
  }, {
    // validator: CustomValidators.mustMatch('newPassword', 'confirmPassword')
    validator: CustomValidators.passwordMatcher
  });

  getUserAccount(email: string): Observable<any> {
    return this.http.get(`${this.baseUrl}` + 'userAccount/' + email);
  }

  validateToken(token: string): Observable<any> {
    return this.http.get(`${this.baseUrl}` + 'validateToken/' + token);
  }

  changePassword(password: any): Observable<any> {
    return this.http.post(`${this.baseUrl}` + 'changePassword', {
      newPassword: password.newPassword,
      confirmNewPassword: password.confirmPassword,
      token: password.token
    });
  }
}
