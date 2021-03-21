import {Component, Input} from '@angular/core';
import {RegistrationDialogFormComponent} from '../../registration/registration-dialog-form/registration-dialog-form.component';
import {MatDialog} from '@angular/material/dialog';
import {EventDetail} from '../../home/home.component';

@Component({
  selector: 'app-event-stats-card',
  templateUrl: './event-stats-card.component.html',
  styleUrls: ['./event-stats-card.component.css']
})
export class EventStatsCardComponent {

  @Input() event: EventDetail;

  constructor(public dialog: MatDialog) { }

  onCreate(event: EventDetail): void {
    this.dialog.open(RegistrationDialogFormComponent, {
      width: '400px',
      disableClose: false,
      autoFocus: true,
      panelClass: 'myapp-dialog',
      data: {event}
    });

  }
}
