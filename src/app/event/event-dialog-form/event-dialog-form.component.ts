import {Component, Inject, OnInit, Optional} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {EventService} from '../../_services/event.service';
import {NotificationService} from '../../_services/notification.service';
import {Subscription} from 'rxjs';
import {EventImageListComponent} from '../event-image-list/event-image-list.component';
import {Project, ProjectService} from '../../_services/project.service';

@Component({
  selector: 'app-event-dialog-form',
  templateUrl: './event-dialog-form.component.html',
  styleUrls: ['./event-dialog-form.component.css'],

})

export class EventDialogFormComponent implements OnInit {

  snack: any;
  capacityWarning = false;
  imageListSub$: Subscription;
  imageValue: string;
  myProject: Project[];
  myProjectValue: any;

  constructor(
    public eventService: EventService,
    private notificationService: NotificationService,
    private projectService: ProjectService,
    public dialogRef: MatDialogRef<EventDialogFormComponent>,
    private dialog: MatDialog,
    private imageListRef: MatDialogRef<EventImageListComponent>,
    @Optional()
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit(): void {
    this.imageValue = this.eventService.eventForm.controls.image.value;

    this.myProject = this.eventService.formProjectList;
    if (this.eventService.user.role === 'ROLE_ADMIN') {
      this.projectService.getAllProjectList().subscribe(data => {
        this.myProject = data;
      });
    }
    this.myProjectValue = this.eventService.eventForm.controls.project.value.id;

  }

  get f() {
    return this.eventService.eventForm.controls;
  }

  onImageList(image: string): void {
    this.imageListRef = this.dialog.open(EventImageListComponent, {
      width: '660px',
      disableClose: false,
      autoFocus: true,
      panelClass: 'myapp-dialog',
      position: {top: '50px', right: '50px'},
      data: {avatar: image}
    });

    this.imageListSub$ = this.imageListRef.afterClosed().subscribe(
      data => {
        this.imageValue = data;
        this.eventService.eventForm.patchValue({image: this.imageValue});
      }
    );
    this.imageListSub$ = this.imageListRef.backdropClick().subscribe(
      () => {
        this.imageListRef.close(this.imageValue);
      }
    );
    this.imageListSub$ = this.imageListRef.keydownEvents().subscribe(
      () => {
        this.imageListRef.close(this.imageValue);
      }
    );
  }


  onSubmit(action: string) {
    if (this.eventService.eventForm.valid) {
      if (action === 'Add') {
        this.eventService.createEvent(this.eventService.eventForm.value)
          .subscribe(() => {
              this.notificationService.success('Successfull', 'INSERT');
            },
            error => console.log(error));

      } else {
        if (action === 'Update') {
          this.eventService.updateEvent(this.eventService.eventForm.get('id').value, this.eventService.eventForm.value)
            .subscribe(() => {
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

  showCapacityWarning(): void {
    this.capacityWarning = !this.capacityWarning;
  }

  onClose() {
    this.eventService.eventForm.reset();
    this.dialogRef.close();
  }

}
