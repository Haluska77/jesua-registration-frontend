import {Component, Inject, OnInit} from '@angular/core';
import {VisitorService} from '../_services/visitor.service';
import {DialogService} from '../_services/dialog.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {AbstractControl} from '@angular/forms';
import {SpinnerService} from '../_services/spinner.service';

@Component({
  selector: 'app-registration-dialog-form',
  templateUrl: './registration-dialog-form.component.html',
  styleUrls: ['./registration-dialog-form.component.css']
})
export class RegistrationDialogFormComponent implements OnInit {

  constructor(public visitorService: VisitorService,
              private dialogService: DialogService,
              public spinnerService: SpinnerService,
              public dialogRef: MatDialogRef<RegistrationDialogFormComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  visitor: any;

  ngOnInit(): void {
    this.visitorService.registerForm.patchValue({course: this.data.course.id});
  }

  get f(): {[p: string]: AbstractControl}  {
    return this.visitorService.registerForm.controls;
  }

  onSubmit() {

    this.visitorService.register(this.visitorService.registerForm.value).subscribe(
      data => {
        this.visitor = data.response;
        if (data.response.body.accepted) {
          this.dialogService.openWideSuccessResponseDialog('Prihlásený', data.response.message, '');
          this.onClose();
        }
        if (!data.response.body.accepted) {
          this.dialogService.openWideWaitingResponseDialog('V poradí', data.response.message, '');
          this.onClose();
        }
      },
      error => {
        this.visitor = error.error.message;
        this.dialogService.openErrorResponseDialog('Error', error.error.message, '');
        this.onClose();
      }
    );
  }

  onClose(): void {
    this.visitorService.registerForm.reset();
    this.dialogRef.close();
  }

}
