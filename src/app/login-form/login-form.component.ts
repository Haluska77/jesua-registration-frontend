import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {LoginService} from '../_services/login.service';
import {Router} from '@angular/router';
import {TokenService} from '../_services/token.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {

  constructor(
    private loginService: LoginService,
    private tokenService: TokenService,
    private router: Router) { }

  submitted = false;
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];

  ngOnInit() {
    if (this.tokenService.getToken()) {
      this.isLoggedIn = true;
      this.roles = this.tokenService.getUser().role;
      this.router.navigate(['/profile']);
    }
  }


  get f() { return this.loginForm.controls; }

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });

  log(x) {
    console.log(x);
  }

  signin() {
    this.submitted = true;
    this.loginService.signIn(this.loginForm.value).subscribe(
      (data:any) => {
        this.tokenService.saveToken(data.response.body.token);
        this.tokenService.saveUser(data.response.body);
        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.roles = this.tokenService.getUser().role;
        this.router.navigate(["/profile"]);
        window.location.reload();
      },
      (err) => {
        this.isLoginFailed = true;
        this.errorMessage = err.error.error.message;
      }
    );
  }
}
