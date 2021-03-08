import {Component, OnInit, ViewChild} from '@angular/core';
import {EventService} from '../_services/event.service';
import {Event} from '../_models/event';
import {Observable, Subject} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {MatTable} from '@angular/material/table';
import {EventDialogFormComponent} from '../event-dialog-form/event-dialog-form.component';
import {DialogService} from '../_services/dialog.service';
import {NotificationService} from '../_services/notification.service';


@Component({
  selector: 'event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css'],
})

export class EventListComponent implements OnInit {

  @ViewChild(MatTable, { static: true }) table: MatTable<any>;

  constructor(
    public eventservice: EventService,
    private dialogService: DialogService,
    private notificationService: NotificationService,
    public dialog: MatDialog) { }

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  events: Observable<Event[]>;

  openDialog(title: string) {
    this.dialog.open(EventDialogFormComponent, {
      width: '400px',
      disableClose: false,
      autoFocus: true,
      panelClass: 'myapp-dialog',
      data: { action: title }
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
      pageLength: 5,
      stateSave: true,
      lengthMenu: [[5, 10, 20, -1], [5, 10, 20, 'All']],
      processing: true,
      language: { url: '//cdn.datatables.net/plug-ins/1.10.22/i18n/Slovak.json' }

    };
    this.eventservice.getEventList().subscribe(
      data => {
        this.events = data.response.body;
        this.dtTrigger.next();
      });
  }
}
