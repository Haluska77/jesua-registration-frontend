import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import jwt_decode from 'jwt-decode';

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  user: string;

  constructor(private router: Router) { }

  signOut() {
    this.user = null;
    sessionStorage.clear();
    this.router.navigate(['/home']);
  }

  public isLoggedIn(token): boolean {
    return (this.getToken() != null && !this.isTokenExpired(token));
  }

  public isTokenExpired(token): boolean {
    return new Date().getTime() > this.tokenExpirationDateTime(token);
  }

  public tokenExpirationDateTime(token): number {
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

  public getUser(): any {
    return JSON.parse(sessionStorage.getItem(USER_KEY));
  }
}
