import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import jwt_decode from 'jwt-decode';

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  user: any;
  tokenSubscription = new Subscription()
  timeout;
  currentTime: any;

  constructor(private router: Router) { }

  signOut() {
    this.tokenSubscription.unsubscribe();
    this.user = null;
    sessionStorage.clear();
    this.router.navigate(["/home"]);
  }

  expirationCounter(timeout) {
    this.tokenSubscription.unsubscribe();
    this.tokenSubscription = of(null).pipe(delay(timeout)).subscribe((expired) => {
      console.log('EXPIRED!!');

      this.signOut();
    });
  }


  public isLoggedIn(token): boolean {
    return (this.getToken() != null && !this.isTokenExpired(token))

  }

  public isTokenExpired(token): boolean {

    const decodedToken = JSON.stringify(jwt_decode(token));
    var exp = JSON.parse(decodedToken).exp * 1000;
    return new Date().getTime() > exp;

  }

  public getTokenExpiration(token): number {
    const decodedToken = JSON.stringify(jwt_decode(token));
    return JSON.parse(decodedToken).exp * 1000;
  }

  public saveToken(token: string) {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string {
    return sessionStorage.getItem(TOKEN_KEY);
  }

  public saveUser(user) {
    sessionStorage.removeItem(USER_KEY);
    sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public getUser() {
    return JSON.parse(sessionStorage.getItem(USER_KEY))
  }
}
