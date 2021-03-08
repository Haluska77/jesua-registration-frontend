import {Component, Inject, Optional} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {EventService} from '../_services/event.service';
import {NotificationService} from '../_services/notification.service';

@Component({
  selector: 'app-event-dialog-form',
  templateUrl: './event-dialog-form.component.html',
  styleUrls: ['./event-dialog-form.component.css'],

})

export class EventDialogFormComponent {

  snack: any;

  constructor(
    public eventService: EventService,
    private notificationService: NotificationService,
    public dialogRef: MatDialogRef<EventDialogFormComponent>,
    @Optional()
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  get f() {
    return this.eventService.eventForm.controls;
  }

  onSubmit(action: string) {
    if (this.eventService.eventForm.valid) {
      if (action === 'Add') {
        this.eventService.createEvent(this.eventService.eventForm.value)
          .subscribe(data => {
              this.notificationService.success('Successfull', 'INSERT');
            },
            error => console.log(error));

      } else {
        if (action === 'Update') {
          this.eventService.updateEvent(this.eventService.eventForm.get('id').value, this.eventService.eventForm.value)
            .subscribe(data => {
                this.snack = this.notificationService.success('Successfull', 'UPDATE');
              },
              error => console.log(error));

        } else {
          this.notificationService.error('Error: no valid action', 'ACTION');
        }
      }
    }
    this.onClose();
  }

  onClose() {
    this.eventService.eventForm.reset();
    this.dialogRef.close();
  }

}
