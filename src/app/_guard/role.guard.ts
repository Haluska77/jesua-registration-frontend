import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router} from '@angular/router';
import {TokenService} from '../_services/token.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private tokenService: TokenService,
              private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot): boolean{
    const entryRole = route.data.entryRole;

    if (!this.tokenService.tokenExists() || this.tokenService.isTokenExpired() || this.tokenService.user.role !== entryRole) {
      this.router.navigate(['/home']);
      return false;
    }
    return true;
  }
}
