import {Injectable} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmDialogComponent} from '../_dialog/confirm-dialog/confirm-dialog.component';
import {ResponseDialogComponent} from '../_dialog/response-dialog/response-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private dialog: MatDialog) { }

  openConfirmDialog(message) {
    return this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      panelClass: 'confirm-dialog-container',
      disableClose: false,
      position: {top: '20px'},
      data: {
        message
      }
    });
  }

  openResponseDialog(icon, style, wide, title, message, navigation) {
    return this.dialog.open(ResponseDialogComponent, {
      width: wide,
      panelClass: 'response-dialog-container',
      disableClose: true,
      position: {top: '20px'},
      data: {
        icon,
        style,
        title,
        message,
        navigator: navigation
      }
    });
  }

  openSuccessResponseDialog(title, message, navigation) {
    return this.openResponseDialog('check_circle_outline', 'success', '300px', title, message, navigation);
  }

  openWaitingResponseDialog(title, message, navigation) {
    return this.openResponseDialog('check_circle_outline', 'waiting', '300px', title, message, navigation);
  }

  openErrorResponseDialog(title, message, navigation) {
    return this.openResponseDialog('highlight_off', 'error', '300px', title, message, navigation);
  }

  openWideSuccessResponseDialog(title, message, navigation) {
    return this.openResponseDialog('check_circle_outline', 'success', '500px', title, message, navigation);
  }

  openWideWaitingResponseDialog(title, message, navigation) {
    return this.openResponseDialog('check_circle_outline', 'waiting', '500px', title, message, navigation);
  }

  openWideErrorResponseDialog(title, message, navigation) {
    return this.openResponseDialog('highlight_off', 'error', '500px', title, message, navigation);
  }

}
