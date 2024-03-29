import {Component, OnInit, ViewChild} from '@angular/core';
import {EventService} from '../../_services/event.service';
import {Observable, Subject} from 'rxjs';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {MatTable} from '@angular/material/table';
import {EventDialogFormComponent} from '../event-dialog-form/event-dialog-form.component';
import {DialogService, FormAction} from '../../_services/dialog.service';
import {NotificationService} from '../../_services/notification.service';
import {TokenService} from '../../_services/token.service';
import {ProjectService} from '../../_services/project.service';


@Component({
  selector: 'event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css'],
})

export class EventListComponent implements OnInit {

  @ViewChild(MatTable, {static: true}) table: MatTable<any>;

  constructor(
    public eventService: EventService,
    private tokenService: TokenService,
    private projectService: ProjectService,
    private dialogService: DialogService,
    private notificationService: NotificationService,
    public eventDialogRef: MatDialogRef<EventDialogFormComponent>,
    public dialog: MatDialog) {
  }

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  events: Observable<any[]>;

  ngOnInit(): void {
    this.dtOptions = {
      pageLength: 5,
      stateSave: true,
      lengthMenu: [[5, 10, 20, -1], [5, 10, 20, 'All']],
      processing: true,
      language: {url: '//cdn.datatables.net/plug-ins/1.10.22/i18n/Slovak.json'}

    };
    this.eventService.getEventListByProjects().subscribe(
      data => {
        this.events = data.response.body;
        this.dtTrigger.next();
      });
  }

  openDialog(title: string): void {
    this.eventDialogRef = this.dialog.open(EventDialogFormComponent, {
      width: '400px',
      disableClose: false,
      autoFocus: true,
      panelClass: 'myapp-dialog',
      data: {action: title}
    });

    this.eventDialogRef.afterClosed().subscribe(
      () => {
        this.eventService.eventForm.reset();
      }
    );
  }

  onCreate(): void {
    this.openDialog(FormAction.ADD);
  }

  onEdit(row: any): void {
    this.eventService.fillEvent(row);
    this.openDialog(FormAction.UPDATE);
  }

  onDelete(id: number): void {
    this.dialogService.openConfirmDialog('Are you sure to delete id: \'' + id + '\' record?')
      .afterClosed().subscribe(response => {
        if (response) {
          this.eventService.deleteEvent(id)
            .subscribe(() => {
                this.notificationService.success('Successfull', 'DELETE');
              }
            );
        }
      }
    );
  }
}
