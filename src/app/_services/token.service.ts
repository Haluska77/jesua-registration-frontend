import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import jwt_decode from 'jwt-decode';
import {takeWhile} from 'rxjs/operators';
import {Observable} from 'rxjs';

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  isLoggedIn = false;
  user: string;
  avatar: string;
  token = this.getToken();
  mins: number;
  secs: number;
  showAdminBoard = false;
  showModeratorBoard = false;

  constructor(private router: Router) { }

  signOut(): void {
    sessionStorage.clear();
    this.router.navigate(['/home']).then(() => {
      window.location.reload();
    });
  }

  initialize(): void {
    if (!!this.token) {
      if (this.isTokenExpired(this.token)) {
        this.signOut();
      } else {
        this.isLoggedIn = true;
        this.observeTimeToExpiration(this.tokenExpirationDateTime(this.token), this.observeCurrentDateTime());

        const user = this.getUser();
        this.avatar = user.avatar;
        this.showAdminBoard = user.role === 'ROLE_ADMIN';
        this.showModeratorBoard = user.role === 'ROLE_MODERATOR';
      }
    }
  }

  observeCurrentDateTime(): Observable<any> {
    return new Observable((observer) => {

      setInterval(() => {
        observer.next(new Date().getTime());
      }, 1000);

    });
  }

  observeTimeToExpiration(expiration: number, observable: any): void {
    const obs$ = observable.pipe(
      takeWhile(value => value < expiration))
      .subscribe({
        next: (now: any) => {
          const timeToLogout = (expiration - now) / 1000;
          this.mins = Math.floor(timeToLogout % (60 * 60) / 60);
          this.secs = Math.floor(timeToLogout % 60);
        },
        complete: () => {
          this.signOut();
          obs$.unsubscribe();
        }
      });
  }

  public isTokenExpired(token): boolean {
    return new Date().getTime() > this.tokenExpirationDateTime(token);
  }

  public tokenExpirationDateTime(token): number {
    const decodedToken = JSON.stringify(jwt_decode(token));
    return JSON.parse(decodedToken).exp * 1000;
  }

  public saveToken(token: string): void {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string {
    return sessionStorage.getItem(TOKEN_KEY);
  }

  public saveUser(user): void {
    sessionStorage.removeItem(USER_KEY);
    sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public getUser(): any {
    return JSON.parse(sessionStorage.getItem(USER_KEY));
  }
}
