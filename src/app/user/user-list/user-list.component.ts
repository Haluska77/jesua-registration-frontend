import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {DialogService} from '../../_services/dialog.service';
import {LoginService} from '../../_services/login.service';
import {NotificationService} from '../../_services/notification.service';
import {UserDialogFormComponent} from '../user-dialog-form/user-dialog-form.component';
import {Subscription} from 'rxjs';
import {TokenService} from '../../_services/token.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit, OnDestroy {

  constructor(
    private loginService: LoginService,
    private dialogService: DialogService,
    private notificationService: NotificationService,
    private token: TokenService,
    private dialog: MatDialog
  ) {
  }

  users: any[];
  dialogService$: Subscription;
  loginService$: Subscription;
  loginServiceAll$: Subscription;
  loggedUser: any;

  ngOnInit() {
    this.loggedUser = this.token.getUser();
    this.loginServiceAll$ = this.loginService.getUsers().subscribe(
      data => {
        this.users = data.response.body;
      });
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

  onCreate(): void {
    this.openDialog('Add', null);
  }

  onEdit(row: any): void {
    this.openDialog('Update', row);
  }

  // currently not invoked from web
  onDelete(id: number): void {
    this.dialogService.openConfirmDialog('Are you sure to delete id: \'' + id + '\' record?')
      .afterClosed().subscribe(response => {
        // delete user from DB
        this.loginService.deleteUser(id)
          .subscribe(
            data => {
              this.notificationService.success('Successfull', 'DELETE');
            }
          );
      }
    );
  }

  makeActive(id: number, userName: string): void {
    this.dialogService$ = this.dialogService.openConfirmDialog('Are you sure to change status for ' + userName + '?')
      .afterClosed().subscribe(data => { // returns true
        if (data) {
          this.loginService$ = this.loginService.makeActive(id).subscribe(
            value => {
            this.dialogService.openSuccessResponseDialog('Zmenený', value.response.message, '../users');

          });
        }
      }
    );
  }

  ngOnDestroy(): void {
    // this.dialogService$.unsubscribe();
    // this.loginService$.unsubscribe();
    // this.loginServiceAll$.unsubscribe();
  }
}
