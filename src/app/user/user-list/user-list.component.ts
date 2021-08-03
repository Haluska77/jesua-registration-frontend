import {Component, OnInit} from '@angular/core';
import {DialogService} from '../../_services/dialog.service';
import {LoginService} from '../../_services/login.service';
import {NotificationService} from '../../_services/notification.service';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {DialogComponentService} from '../../_services/dialog-component.service';

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
    private dialogComponentService: DialogComponentService
  ) {
  }

  users$: Observable<any>;

  ngOnInit() {
    this.users$ = this.loginService.getUsers()
      .pipe(map(data => data.response.body));
  }

  onCreate(): void {
    this.dialogComponentService.openUserDialogComponent('Add', null);
  }

  // currently not invoked from web
  onDelete(id: number): void {
    this.dialogService.openConfirmDialog('Are you sure to delete id: \'' + id + '\' record?')
      .afterClosed().subscribe(() => {
        // delete user from DB
        this.loginService.deleteUser(id)
          .subscribe(() => {
              this.notificationService.success('Successfull', 'DELETE');
            }
          );
      }
    );
  }
}
