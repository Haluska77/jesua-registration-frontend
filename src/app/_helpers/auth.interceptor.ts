import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Router } from '@angular/router';
import { TokenService } from '../_services/token.service';
import { catchError, tap } from "rxjs/operators";
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
  
export class AuthInterceptor implements HttpInterceptor {

    constructor(private token: TokenService,
    private router: Router) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
        
        let authReq = req;
        const token = this.token.getToken();
        if (token != null) {
            authReq = req.clone({ headers: req.headers.set('Authorization', 'Bearer ' + token) });
        }
        return next.handle(authReq)
        .pipe(
          catchError((error: any) => {
            let errorMsg = '';
            if (error instanceof HttpErrorResponse) {
              if (error instanceof ErrorEvent) {
                console.log('this is client side error');
                errorMsg = `Error: ${error}`;
              }
              else { // instanceof HttpError
                // console.log('this is server side error');
                errorMsg = `ERROR CODE: ${error.status},  MESSAGE: ${error.error.message}`;
              }
              console.log("SERVER SIDE ERROR: " + error.error);
            } else {
              console.error("some thing else happened");
            }
            return throwError(error);
          })
      )

        //     .pipe(tap((event: HttpEvent<any>) => {
        //     if(event instanceof HttpResponse){
        //       // if the token is valid
        //     }
        //   }, (err: any) => {
        //     // if the token has expired.
        //     if(err instanceof HttpErrorResponse){
        //       if(err.status === 500){
        //         // this is where you can do anything like navigating
        //         this.router.navigateByUrl('/home');
        //       }
        //     }
        //   }));
        
    }
}

export const authInterceptorProviders = [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}
]