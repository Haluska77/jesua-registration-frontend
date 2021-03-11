import {Component, OnDestroy, OnInit} from '@angular/core';
import {TokenService} from './_services/token.service';
import {Observable} from 'rxjs';
import {
  Event as RouterEvent,
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router
} from '@angular/router';
import {takeWhile} from 'rxjs/operators';
import {MediaService} from './_services/media.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit, OnDestroy {

  isLoggedIn = false;
  avatar: string;
  token: string = this.tokenService.getToken();
  mins: number;
  secs: number;
  showAdminBoard = false;
  showModeratorBoard = false;

  loading = true;


  constructor(
    private tokenService: TokenService,
    private router: Router,
    public mediaService: MediaService) {

    router.events.subscribe((event: RouterEvent) => {
      this.navigationInterceptor(event);
    });
  }

  navigationInterceptor(event: RouterEvent): void {
    if (event instanceof NavigationStart) {
      this.loading = true;
    }
    if (event instanceof NavigationEnd) {
      setTimeout(() => {
        this.loading = false;
      }, 500);
    }

    // Set loading state to false in both of the below events to hide the spinner in case a request fails
    if (event instanceof NavigationCancel) {
      setTimeout(() => {
        this.loading = false;
      }, 500);
    }
    if (event instanceof NavigationError) {
      setTimeout(() => {
        this.loading = false;
      }, 500);
    }
  }

  ngOnInit(): void {

    const expirationObservable$ = new Observable((observer) => {

      setInterval(() => {
        observer.next(new Date().getTime());
      }, 1000);

    });

    if (!!this.tokenService.getToken()) {
      if (this.tokenService.isTokenExpired(this.token)) {
        this.logout();
      } else {
        this.isLoggedIn = true;
        const expiration = this.tokenService.tokenExpirationDateTime(this.token);

        const obs$ = expirationObservable$.pipe(
          takeWhile(value => value < expiration))
          .subscribe({
            next: (now: any) => {
              const timeToLogout = (expiration - now) / 1000;
              this.mins = Math.floor(timeToLogout % (60 * 60) / 60);
              this.secs = Math.floor(timeToLogout % 60);
            },
            complete: () => {
              this.logout();
              obs$.unsubscribe();
            }
          });

        const user = this.tokenService.getUser();
        this.avatar = user.avatar;

        this.showAdminBoard = user.role === 'ROLE_ADMIN';
        this.showModeratorBoard = user.role === 'ROLE_MODERATOR';
      }
    }
  }

  logout(): void {
    this.tokenService.signOut();
    this.isLoggedIn = false;
  }

  ngOnDestroy(): void {
    this.mediaService.mediaSub$.unsubscribe();
  }
}
