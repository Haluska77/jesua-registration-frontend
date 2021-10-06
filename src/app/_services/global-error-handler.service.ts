import {HttpErrorResponse} from '@angular/common/http';
import {ErrorHandler, Injectable, Injector} from '@angular/core';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class GlobalErrorHandlerService implements ErrorHandler{

  constructor(private injector: Injector) { }


  handleError(error: Error | HttpErrorResponse) {
    const router = this.injector.get(Router);
    router.navigate(["/error"]);
 }
}
