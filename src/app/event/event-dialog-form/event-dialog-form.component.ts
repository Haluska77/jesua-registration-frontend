import {Component, Inject, OnInit, Optional} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {EventService} from '../../_services/event.service';
import {NotificationService} from '../../_services/notification.service';
import {Subscription} from 'rxjs';
import {EventImageListComponent} from '../event-image-list/event-image-list.component';
import {Project, ProjectService} from '../../_services/project.service';
import {FileS3Service} from '../../_services/file-s3.service';
import {DialogService} from '../../_services/dialog.service';

@Component({
  selector: 'app-event-dialog-form',
  templateUrl: './event-dialog-form.component.html',
  styleUrls: ['./event-dialog-form.component.css'],

})

export class EventDialogFormComponent implements OnInit {

  capacityWarning = false;
  imageListSub$: Subscription;
  imageValue: string;
  s3Image: string;
  myProjects: Project[];
  myProjectValue: number;

  constructor(
    public eventService: EventService,
    private notificationService: NotificationService,
    private projectService: ProjectService,
    private s3Service: FileS3Service,
    private dialogService: DialogService,
    public dialogRef: MatDialogRef<EventDialogFormComponent>,
    private dialog: MatDialog,
    private imageListRef: MatDialogRef<EventImageListComponent>,
    @Optional()
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit(): void {
    this.imageValue = this.eventService.eventForm.controls.image.value;
    if (this.eventService.eventForm.controls.project.value != null) {
      this.myProjectValue = this.eventService.eventForm.controls.project.value.id;
    }
    this.s3Image = this.s3Service.getS3Image(this.myProjectValue, this.imageValue);

    this.myProjects = this.eventService.activeUserProjectList;

    if (this.eventService.user.role === 'ROLE_ADMIN') {
      this.projectService.getAllProjectList().subscribe(data => {
        this.myProjects = data;
      });
    }
  }

  get f() {
    return this.eventService.eventForm.controls;
  }

  showImageList(project: number, s3image: string, imageValue: string): void {
    if (project === undefined) {
      this.dialogService.openErrorResponseDialog('Error', 'Vyberte projekt predtým ako vyberiete obrázok', null);
    } else {
      this.imageListRef = this.dialog.open(EventImageListComponent, {
        width: '660px',
        disableClose: false,
        autoFocus: true,
        panelClass: 'myapp-dialog',
        position: {top: '50px', right: '50px'},
        data: {project, s3image, imageValue}
      });

      this.imageListSub$ = this.imageListRef.afterClosed().subscribe(
        image => {
          this.s3Image = image.s3Value;
          this.eventService.eventForm.patchValue({image: image.imageValue});
        }
      );
      this.imageListSub$ = this.imageListRef.backdropClick().subscribe(
        () => {
          this.imageListRef.close({imageValue: this.imageValue, s3Value: this.s3Image});
        }
      );
      this.imageListSub$ = this.imageListRef.keydownEvents().subscribe(
        () => {
          this.imageListRef.close({imageValue: this.imageValue, s3Value: this.s3Image});
        }
      );
    }
  }

  onSubmit(action: string) {
    if (this.eventService.eventForm.valid) {
      if (action === 'Add') {
        this.eventService.createEvent(this.eventService.eventForm.value)
          .subscribe(() => {
            this.notificationService.success('Successfull', 'INSERT');
          });

      } else {
        if (action === 'Update') {
          this.eventService.updateEvent(this.eventService.eventForm.get('id').value, this.eventService.eventForm.value)
            .subscribe(() => {
              this.notificationService.success('Successfull', 'UPDATE');
            });

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

  compareFunction(o1: any, o2: any): boolean {
    return o1 && o2 ? o1 === o2.id : false;
  }

  onProjectChange() {
    this.myProjectValue = this.eventService.eventForm.controls.project.value;
  }

  onClose() {
    this.eventService.eventForm.reset();
    this.dialogRef.close();
  }
}
