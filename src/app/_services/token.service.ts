import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import jwt_decode from 'jwt-decode';
import {takeWhile} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {Project} from './project.service';
import {ProjectRole} from './user-project.service';
import { UserRole } from './login.service';

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';
export const DEFAULT_AVATAR = '001-default.svg';

export interface JwtUserDetail {
  id: string;
  name: string;
  email: string;
  avatar: string;
  active: boolean;
  role: string;
  token: string;
  created: string;
  projects: JwtProjects[];
}

export interface JwtProjects {
  user: JwtUserDetail;
  project: Project;
  role: ProjectRole;
  created: string;
}

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  isLoggedIn = false;
  user: JwtUserDetail = this.getUser();
  token = this.getToken();
  userAvatar: string;
  userProjectList: Project[];
  activeUserProjectList: Project[];
  mins: number;
  secs: number;
  showAdminBoard = false;
  showModeratorBoard = false;

  constructor(private router: Router) {
  }

  signOut(): void {
    localStorage.clear();
    this.router.navigate(['/home']).then(() => {
      window.location.reload();
    });
  }

  initialize(): void {
    if (this.tokenExists()) {
      if (this.isTokenExpired()) {
        this.signOut();
      } else {
        this.isLoggedIn = true;
        this.observeTimeToExpiration(this.tokenExpirationDateTime(this.token), this.observeCurrentDateTime());

        this.userAvatar = this.getUserAvatar();
        this.userProjectList = this.user.projects
          .map(userProject => userProject.project);

        this.activeUserProjectList = this.userProjectList
          .filter(proj => proj.active === true);

        this.showAdminBoard = this.user.role === UserRole.ROLE_ADMIN;
        this.showModeratorBoard = this.user.role === UserRole.ROLE_MODERATOR;
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

  public tokenExists(): boolean {
    return !!this.getToken();
  }

  public isTokenExpired(): boolean {
    return new Date().getTime() > this.tokenExpirationDateTime(this.getToken());
  }

  public tokenExpirationDateTime(token): number {
    const decodedToken = JSON.stringify(jwt_decode(token));
    return JSON.parse(decodedToken).exp * 1000;
  }

  public saveToken(token: string): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string {
    return localStorage.getItem(TOKEN_KEY);
  }

  public saveUser(user): void {
    localStorage.removeItem(USER_KEY);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public getUser(): JwtUserDetail {
    return JSON.parse(localStorage.getItem(USER_KEY));
  }

  public getUserProjectsIds(): number[] {
    return this.user.projects.map((item: any) => item.project.id);
  }
  
  public getUserAvatar(): string {
    return !!this.user.avatar ? this.user.avatar : DEFAULT_AVATAR;
  }
}
