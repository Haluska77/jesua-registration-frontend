import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {DialogService} from '../../_services/dialog.service';
import {LoginService} from '../../_services/login.service';
import {NotificationService} from '../../_services/notification.service';
import {UserDialogFormComponent} from '../user-dialog-form/user-dialog-form.component';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  constructor(
    private loginService: LoginService,
    private dialogService: DialogService,
    private notificationService: NotificationService,
    private dialog: MatDialog
  ) {
  }

  users$: Observable<any>;

  ngOnInit() {
    this.users$ = this.loginService.getUsers()
      .pipe(map(data => data.response.body));
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

  // currently not invoked from web
  onDelete(id: number): void {
    this.dialogService.openConfirmDialog('Are you sure to delete id: \'' + id + '\' record?')
      .afterClosed().subscribe(() => {
        // delete user from DB
        this.loginService.deleteUser(id)
          .subscribe(
            () => {
              this.notificationService.success('Successfull', 'DELETE');
            }
          );
      }
    );
  }
}
