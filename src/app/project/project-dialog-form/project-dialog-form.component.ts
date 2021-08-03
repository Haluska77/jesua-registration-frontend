import {Component, Inject, OnInit, Optional} from '@angular/core';
import {NotificationService} from '../../_services/notification.service';
import {ProjectService} from '../../_services/project.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ProjectAsyncValidator} from '../../project-async-validator';
import {TokenService} from '../../_services/token.service';

@Component({
  selector: 'app-project-dialog-form',
  templateUrl: './project-dialog-form.component.html',
  styleUrls: ['./project-dialog-form.component.css']
})
export class ProjectDialogFormComponent implements OnInit {

  constructor(
    private notificationService: NotificationService,
    private tokenService: TokenService,
    public projectService: ProjectService,
    private projectAsyncValidator: ProjectAsyncValidator,
    public dialogRef: MatDialogRef<ProjectDialogFormComponent>,
    @Optional()
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  projectForm: FormGroup;

  ngOnInit(): void {

    this.projectForm = new FormGroup({
      id: new FormControl(''),
      userId: new FormControl(this.tokenService.user.id),
      shortName: new FormControl('', {
          validators: [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(12)]
        }
      ),
      description: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(60)]),
      active: new FormControl(true)
    });

    if (this.data.action === 'Add') {
      this.projectForm.controls.shortName.setAsyncValidators(this.projectAsyncValidator.duplicateShortName());
    }

    if (this.data.action === 'Update') {
      this.projectForm.controls.shortName.disable();
      this.projectForm.patchValue(this.data.project);
    }

  }

  get f() {
    return this.projectForm.controls;
  }

  onSubmit(action: string) {
    if (action === 'Add') {
      this.projectService.addProject(this.projectForm.controls.userId.value, this.projectForm.value)
        .subscribe(() => {
            this.notificationService.success('Successful', 'INSERT');
          });

    } else {
      if (action === 'Update') {
        this.projectService.updateProject(this.projectForm.controls.id.value, this.projectForm.value)
          .subscribe(() => {
            this.notificationService.success('Successful', 'UPDATE');
          });
      } else {
        this.notificationService.error('Error: no valid action', 'ACTION');
      }
    }
    this.onClose();
  }

  onClose() {
    this.projectForm.reset();
    this.dialogRef.close();
  }
}
