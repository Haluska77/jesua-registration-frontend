import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import jwt_decode from 'jwt-decode';
import {takeWhile} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {Project, ProjectService} from './project.service';

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  isLoggedIn = false;
  user = this.getUser();
  token = this.getToken();
  userAvatar: string;
  userProjectList: Project[];
  activeUserProjectList: Project[];
  mins: number;
  secs: number;
  showAdminBoard = false;
  showModeratorBoard = false;

  constructor(private router: Router,
              private projectService: ProjectService) {
  }

  signOut(): void {
    sessionStorage.clear();
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

        this.userAvatar = this.user.avatar;
        this.userProjectList = this.user.projects;

        this.activeUserProjectList = this.user.projects
          .filter(proj => proj.project.active === true)
          .map(item => {
            const project = new Project();
            project.id = item.project.id;
            project.shortName = item.project.shortName;
            return project;
          });

        this.showAdminBoard = this.user.role === 'ROLE_ADMIN';
        this.showModeratorBoard = this.user.role === 'ROLE_MODERATOR';
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

  public getUserProjects(): any[] {
    return this.getUser().projects;
  }

  public getUserProjectsIds(): number[] {
    return this.getUserProjects().map((item: any) => item.project.id);
  }
}
