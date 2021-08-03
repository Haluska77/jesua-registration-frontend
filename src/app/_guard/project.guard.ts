import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {TokenService} from '../_services/token.service';
import {UserProjectService} from '../_services/user-project.service';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProjectGuard implements CanActivate {

  constructor(private tokenService: TokenService,
              private userProjectService: UserProjectService,
              private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const projectId: string = route.params.projectId;
    const userId = this.tokenService.user.id;

    this.userProjectService.getUserProjectIdList()
      .pipe(
        map((data: any) => data.response.body
          .some(d => d.project === Number(projectId) && d.user === userId)
        )
      ).subscribe(result => {
      if (!result) {
        this.router.navigate(['/projects']);
      }
    });

    return true;
  }

}
