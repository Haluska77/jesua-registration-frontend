import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {LoginService} from '../_services/login.service';
import {ActivatedRoute, Router} from '@angular/router';
import {TokenService} from '../_services/token.service';
import { OauthService } from '../_services/oauth.service';
import { environment } from 'src/environments/environment';
import { filter} from 'rxjs/operators';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {

  constructor(
    private loginService: LoginService,
    private tokenService: TokenService,
    private oauthService: OauthService,
    private router: Router,
    private route: ActivatedRoute) { }


  get f() { return this.loginForm.controls; }

  submitted = false;
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];
  hidePassword = true;
  isProduction = environment.production;

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });

  ngOnInit() {
    if (this.tokenService.getToken()) {
      this.isLoggedIn = true;
      this.router.navigate(['/profile']);
    } else {
      this.route.queryParams
      .pipe(
        filter(item => item.token))
      .subscribe(
        params=> {
          this.tokenService.saveToken(params.token);
          this.oauthService.getOauthUser().subscribe((data: any) => {
            this.tokenService.saveToken(data.response.body.token);
            this.tokenService.saveUser(data.response.body);
            this.router.navigate(['/profile'])
              .then(() => {
                window.location.reload();
              });
          }, error => {
            this.tokenService.signOut();
          });
        }
      )
    }
  }

  signin() {
    this.submitted = true;
    this.loginService.signIn(this.loginForm.value).subscribe(
      (data: any) => {
        this.tokenService.saveToken(data.response.body.token);
        this.tokenService.saveUser(data.response.body);
        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.router.navigate(['/profile'])
        .then(() => {
          window.location.reload();
        });
      },
      (err) => {
        this.isLoginFailed = true;
        this.errorMessage = err.error.error.message;
      }
    );
  }

  googleSignIn() {
    window.open(this.oauthService.baseUrl + this.oauthService.authorizationEndpoint, '_self');
  }
}
