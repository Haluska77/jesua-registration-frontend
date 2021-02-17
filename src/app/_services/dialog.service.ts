import {Injectable} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmDialogComponent} from '../confirm-dialog/confirm-dialog.component';
import {ResponseDialogComponent} from '../response-dialog/response-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private dialog: MatDialog) { }

  openConfirmDialog(message) {
    return this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      panelClass:'confirm-dialog-container',
      disableClose: true,
      position:{top:"20px"},
      data: {
        message : message
      }
    });
  }

  openResponseDialog(icon, style, title, message, navigation) {
    return this.dialog.open(ResponseDialogComponent, {
      width: '300px',
      panelClass:'response-dialog-container',
      disableClose: true,
      position:{top:"20px"},
      data: {
        icon: icon,
        style: style,
        title: title,
        message: message,
        navigator: navigation
      }
    });
  }

  openSuccessResponseDialog(title, message, navigation) {
    return this.openResponseDialog('check_circle_outline', 'success', title, message, navigation);
  }

  openWaitingResponseDialog(title, message, navigation) {
    return this.openResponseDialog('check_circle_outline', 'waiting', title, message, navigation);
  }

  openErrorResponseDialog(title, message, navigation) {
    return this.openResponseDialog('highlight_off', 'error', title, message, navigation);
  }

}
