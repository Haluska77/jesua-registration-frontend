import {Component, Inject, OnInit, Optional} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {EventService} from '../../_services/event.service';
import {NotificationService} from '../../_services/notification.service';
import {Subscription} from 'rxjs';
import {EventImageListComponent} from '../event-image-list/event-image-list.component';
import {Project, ProjectService} from '../../_services/project.service';
import {FileS3Service} from '../../_services/file-s3.service';
import {DialogService, FormAction} from '../../_services/dialog.service';
import {SafeUrl} from '@angular/platform-browser';
import {TokenService} from '../../_services/token.service';
import { UserRole } from 'src/app/_services/login.service';

@Component({
  selector: 'app-event-dialog-form',
  templateUrl: './event-dialog-form.component.html',
  styleUrls: ['./event-dialog-form.component.css'],

})

export class EventDialogFormComponent implements OnInit {

  capacityWarning = false;
  imageListSub$: Subscription;
  imageValue: string;
  imageUrl: SafeUrl;
  myProjects: Project[];

  myProjectValue: number;

  constructor(
    private tokenService: TokenService,
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

    if (this.data.action === FormAction.ADD) {
      this.eventService.eventForm.patchValue({userId: this.tokenService.user.id});
    }

    if (this.tokenService.user.role === UserRole.ROLE_ADMIN) {
      this.projectService.getAllProjectList()
        .pipe()
        .subscribe(data => {
          this.myProjects = data;
        });
    } else {
      this.myProjects = this.tokenService.activeUserProjectList;
    }

    if (this.eventService.eventForm.controls.project.value != null) {
      this.myProjectValue = this.eventService.eventForm.controls.project.value.id;
    }

    this.imageValue = this.eventService.eventForm.controls.image.value;
    if (this.imageValue == null) {
      this.imageUrl = this.s3Service.defaultImage;
    } else {
      this.s3Service.displayImage(this.imageValue).subscribe(data => this.imageUrl = data);
    }
  }

  get f() {
    return this.eventService.eventForm.controls;
  }

  showImageList(project: number, s3image: SafeUrl, imageValue: string): void {
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
          this.imageUrl = image.imageUrl;
          this.eventService.eventForm.patchValue({image: image.imageValue});
        }
      );
      this.imageListSub$ = this.imageListRef.backdropClick().subscribe(
        () => {
          this.imageListRef.close({imageValue: this.imageValue, imageUrl: this.imageUrl});
        }
      );
      this.imageListSub$ = this.imageListRef.keydownEvents().subscribe(
        () => {
          this.imageListRef.close({imageValue: this.imageValue, imageUrl: this.imageUrl});
        }
      );
    }
  }

  onSubmit(action: string) {
    if (this.eventService.eventForm.valid) {
      if (action === FormAction.ADD) {
        this.eventService.createEvent(this.eventService.eventForm.value)
          .subscribe(() => {
            this.notificationService.success('Successfull', 'INSERT');
          });

      } else {
        if (action === FormAction.UPDATE) {
          this.eventService.updateEvent(this.eventService.eventForm.controls.id.value, this.eventService.eventForm.value)
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

  compareFunction(o1: number, o2: Project): boolean {
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
