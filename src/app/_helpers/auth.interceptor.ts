import {
  HTTP_INTERCEPTORS,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {TokenService} from '../_services/token.service';
import {catchError, tap} from 'rxjs/operators';
import {Observable, throwError} from 'rxjs';
import {SpinnerService} from '../_services/spinner.service';
import {DialogService} from '../_services/dialog.service';

@Injectable({
  providedIn: 'root'
})

export class AuthInterceptor implements HttpInterceptor {

  constructor(private token: TokenService,
              private router: Router,
              private spinnerService: SpinnerService,
              private dialogService: DialogService) {
  }

  intercept(httpRequest: HttpRequest<any>, httpHandler: HttpHandler): Observable<any> {

    let authReq = httpRequest;
    const token = this.token.getToken();
    if (token != null) {
      authReq = httpRequest.clone({headers: httpRequest.headers.set('Authorization', 'Bearer ' + token)});
    }

    this.spinnerService.show();

    return httpHandler.handle(authReq)
      .pipe(
        tap((event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            this.spinnerService.hide();
          }
        }, () => {
          this.spinnerService.hide();
        }),
        catchError((error: any) => {
          // let errorMsg = '';
          if (error instanceof HttpErrorResponse) {
            // handle HttpErrorResponse individually in component
            // if (error instanceof ErrorEvent) {
            //   console.log('this is client side error');
            //   errorMsg = `${error}`;
            // } else { // instanceof HttpError
            //   errorMsg = `${error.error.error.message}`;
            // }
          } else {
            this.dialogService.openErrorResponseDialog('Error' + `${error.status}`, 'Unexpected error!!!', '/home');
          }
          return throwError(error);
        })
      );
  }
}

export const authInterceptorProviders = [
  {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}
];
