import {Component, OnInit} from '@angular/core';
import {TokenService} from './_services/token.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

  constructor(
    private tokenService: TokenService) {

    // router.events.subscribe((event: RouterEvent) => {
    //   this.navigationInterceptor(event);
    // });
  }
  //
  // navigationInterceptor(event: RouterEvent): void {
  //   if (event instanceof NavigationStart) {
  //     this.loading = true;
  //   }
  //   if (event instanceof NavigationEnd) {
  //     setTimeout(() => {
  //       this.loading = false;
  //     }, 500);
  //   }
  //
  //   if (event instanceof NavigationCancel) {
  //     setTimeout(() => {
  //       this.loading = false;
  //     }, 500);
  //   }
  //   if (event instanceof NavigationError) {
  //     setTimeout(() => {
  //       this.loading = false;
  //     }, 500);
  //   }
  // }

  ngOnInit(): void {
    this.tokenService.initialize();
  }

}
