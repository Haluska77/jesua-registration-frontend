import {Component, Input, OnInit} from '@angular/core';
import {UserDialogFormComponent} from '../user-dialog-form/user-dialog-form.component';
import {DialogService} from '../../_services/dialog.service';
import {LoginService} from '../../_services/login.service';
import {MatDialog} from '@angular/material/dialog';
import {TokenService} from '../../_services/token.service';

@Component({
  selector: 'app-user-detail-card',
  templateUrl: './user-detail-card.component.html',
  styleUrls: ['./user-detail-card.component.css']
})
export class UserDetailCardComponent implements OnInit {
  @Input() user: any;

  loggedUser: any;

  constructor(    private loginService: LoginService,
                  private dialogService: DialogService,
                  private token: TokenService,
                  private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.loggedUser = this.token.getUser();
  }

  openDialog(title: string, user: any) {
    this.dialog.open(UserDialogFormComponent, {
      width: '400px',
      disableClose: false,
      autoFocus: true,
      panelClass: 'myapp-dialog',
      data: {action: title, user}
    });
  }

  onEdit(row: any): void {
    this.openDialog('Update', row);
  }

  makeActive(id: number, userName: string): void {
    this.dialogService.openConfirmDialog('Are you sure to change status for ' + userName + '?')
      .afterClosed().subscribe(data => { // returns true
          if (data) {
            this.loginService.makeActive(id)
              .subscribe(value => {
                this.dialogService.openSuccessResponseDialog('Zmenený', value.response.message, '../users');

              });
          }
        }
      );
  }
}
