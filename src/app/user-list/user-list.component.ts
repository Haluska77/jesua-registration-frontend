import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Subject} from 'rxjs';
import {DialogService} from '../_services/dialog.service';
import {EventService} from '../_services/event.service';
import {LoginService} from '../_services/login.service';
import {NotificationService} from '../_services/notification.service';
import {UserDialogFormComponent} from '../user-dialog-form/user-dialog-form.component';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  constructor(
    private loginService: LoginService,
    public eventservice: EventService,
    private dialogService: DialogService,
    private notificationService: NotificationService,
    public dialog: MatDialog
  ) {
  }

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  users: any[];
  isChanged = false;


  openDialog(title: string) {
    this.dialog.open(UserDialogFormComponent, {
      width: '30%',
      disableClose: true,
      autoFocus: true,
      panelClass: 'myapp-dialog',
      data: {action: title}
    });

  }

  onCreate() {
    this.openDialog('Add');
  }

  onEdit(row: any) {
    this.eventservice.fillEvent(row);
    this.openDialog('Update');
  }

  onDelete(id: number) {
    this.dialogService.openConfirmDialog('Are you sure to delete id: \'' + id + '\' record?')
      .afterClosed().subscribe(response => {
        if (response) {
          // delete event in DB
          this.eventservice.deleteEvent(id)
            .subscribe(
              data => {
                this.notificationService.success('Successfull', 'DELETE');
              }
            );
        }
      }
    );
  }

  ngOnInit() {
    this.dtOptions = {
      pageLength: 10,
      stateSave: true,
      lengthMenu: [[10, 20, 50, -1], [10, 20, 50, 'All']],
      processing: true,
      order: [[0, 'asc']],
      language: {url: '//cdn.datatables.net/plug-ins/1.10.22/i18n/Slovak.json'}
    };
    this.loginService.getUsers().subscribe(
      data => {
        this.users = data.response.body;
        this.dtTrigger.next();
      });
  }

  exit() {
    window.location.reload();
  }

  makeActive(id: number, userName: string) {
    this.dialogService.openConfirmDialog('Are you sure to change status for ' + userName + '?')
      .afterClosed().subscribe(data => {
        if (data) {
          this.loginService.makeActive(id).subscribe();
          window.location.reload();
        }
      }
    );
  }
}
