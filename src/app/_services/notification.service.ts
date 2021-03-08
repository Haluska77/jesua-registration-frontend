import {Injectable} from '@angular/core';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(public snackBar: MatSnackBar) { }

  config: MatSnackBarConfig = {
    duration: 2000,
    horizontalPosition: 'right',
    verticalPosition: 'top',
  }

  success(msg: string, label: string) {
    this.config.panelClass = ['success'];
    let snackBarRef = this.snackBar.open(msg, label, this.config);

    snackBarRef.afterDismissed().subscribe(() => {
      window.location.reload();
    });
  }

  error(msg: string, label: string) {
    this.config.panelClass = ['error'];
    this.snackBar.open(msg, label, this.config);
  }
}
