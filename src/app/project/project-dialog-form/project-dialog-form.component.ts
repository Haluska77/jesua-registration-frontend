import {Component, Inject, OnInit, Optional} from '@angular/core';
import {NotificationService} from '../../_services/notification.service';
import {ProjectService} from '../../_services/project.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-project-dialog-form',
  templateUrl: './project-dialog-form.component.html',
  styleUrls: ['./project-dialog-form.component.css']
})
export class ProjectDialogFormComponent implements OnInit {

  constructor(
    private notificationService: NotificationService,
    public projectService: ProjectService,
    public dialogRef: MatDialogRef<ProjectDialogFormComponent>,
    @Optional()
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit(): void {
  }

  get f() {
    return this.projectService.projectForm.controls;
  }

  onSubmit(action: string) {
    if (action === 'Add') {
      this.projectService.addProject(this.projectService.projectForm.controls.userId.value, this.projectService.projectForm.value)
        .subscribe(data => {
            this.notificationService.success('Successful', 'INSERT');
          },
          error => console.log(error));

    } else {
      if (action === 'Update') {
        this.projectService.updateProject(this.projectService.projectForm.controls.id.value, this.projectService.projectForm.value)
          .subscribe(data => {
            this.notificationService.success('Successful', 'UPDATE');

          });
      } else {
        this.notificationService.error('Error: no valid action', 'ACTION');
      }
    }
    this.onClose();
  }

  onClose() {
    this.projectService.projectForm.reset();
    this.dialogRef.close();
  }
}
