import {Component, OnInit} from '@angular/core';
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

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  private roles: string[];
  isLoggedIn = false;
  email: string;
  token = this.tokenService.getToken();
  mins: number;
  secs: number;

  showAdminBoard = false;
  showModeratorBoard = false;

  loading = true;

  constructor(private tokenService: TokenService, private router: Router) {
    router.events.subscribe((event: RouterEvent) => {
      this.navigationInterceptor(event);
    });
  }

  navigationInterceptor(event: RouterEvent): void {
    if (event instanceof NavigationStart) {
      this.loading = true;
    }
    if (event instanceof NavigationEnd) {
      setTimeout(() => { // here
        this.loading = false;
      }, 500);
    }

    // Set loading state to false in both of the below events to hide the spinner in case a request fails
    if (event instanceof NavigationCancel) {
      setTimeout(() => { // here
        this.loading = false;
      }, 500);
    }
    if (event instanceof NavigationError) {
      setTimeout(() => { // here
        this.loading = false;
      }, 500);
    }
  }

  ngOnInit() {

    const simpleObservable = new Observable((observer) => {

      setInterval(() => {
        observer.next(new Date().getTime());
      }, 1000);

    });

    if (this.tokenService.isLoggedIn(this.token)) {
      this.isLoggedIn = true;
      const expiration = this.tokenService.tokenExpirationDateTime(this.token);

      let obs = simpleObservable.subscribe((now: any) => {
        let logtime = (expiration - now) / 1000;
        this.mins = Math.floor(logtime % (60 * 60) / 60);
        this.secs = Math.floor(logtime % 60);
        if (logtime < 0) {
          obs.unsubscribe();
          this.isLoggedIn = false;
          this.logout();
        }
      }
      );

      const user = this.tokenService.getUser();
      this.roles = user.role;
      this.email = user.email;

      this.showAdminBoard = this.roles.includes('ROLE_ADMIN');
      this.showModeratorBoard = this.roles.includes('ROLE_MODERATOR');
    }
  }

  logout() {
    this.tokenService.signOut();
  }

}
