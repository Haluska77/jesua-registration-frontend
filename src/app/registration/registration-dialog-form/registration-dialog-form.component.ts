import {Component, Inject, OnInit} from '@angular/core';
import {FollowerService} from '../../_services/follower.service';
import {DialogService} from '../../_services/dialog.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {AbstractControl} from '@angular/forms';

@Component({
  selector: 'app-registration-dialog-form',
  templateUrl: './registration-dialog-form.component.html',
  styleUrls: ['./registration-dialog-form.component.css']
})
export class RegistrationDialogFormComponent implements OnInit {

  constructor(public followerService: FollowerService,
              private dialogService: DialogService,
              public dialogRef: MatDialogRef<RegistrationDialogFormComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  visitor: any;

  ngOnInit(): void {
    this.followerService.registerForm.patchValue({course: this.data.event.event.id, gdpr: true});
  }

  get f(): {[p: string]: AbstractControl}  {
    return this.followerService.registerForm.controls;
  }

  onSubmit() {
    this.dialogRef.close();
    this.followerService.register(this.followerService.registerForm.value)
      .subscribe(data => {
        this.visitor = data.response;
        if (data.response.body.accepted) {
          this.dialogService.openWideSuccessResponseDialog('Prihlásený', data.response.message, '');
        }
        if (!data.response.body.accepted) {
          this.dialogService.openWideWaitingResponseDialog('V poradí', data.response.message, '');
        }
      },
      error => {
        this.visitor = error.error.message;
        this.dialogService.openErrorResponseDialog('Error', error.error.message, '');
      }
    );
  }

  onClose(): void {
    this.followerService.registerForm.reset();
    this.dialogRef.close();
  }

}
