import {Component, Inject, Optional} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {CustomValidators} from '../custom-validators';
import {LoginService} from '../_services/login.service';
import {NotificationService} from '../_services/notification.service';

interface Role {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-user-dialog-form',
  templateUrl: './user-dialog-form.component.html',
  styleUrls: ['./user-dialog-form.component.css']
})

export class UserDialogFormComponent {

  constructor(private fb: FormBuilder,
              private loginService: LoginService,
              private notificationService: NotificationService,
              public dialogRef: MatDialogRef<UserDialogFormComponent>,
              @Optional()
    @Inject(MAT_DIALOG_DATA) public data: any)
{ }

  snack: any;
  hidePassword = true;

  userForm = this.fb.group({
    id: [''],
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required,
    CustomValidators.validateEmailPattern()]],
    password: ['', [
      Validators.required,
      Validators.minLength(8),
      CustomValidators.containsAtLeastOneNumber()
    ]],
    role: ['', [Validators.required]],
    active: ['']
  });

  roles: Role[] = [
    {value: 'ROLE_ADMIN', viewValue: 'ADMIN'},
    {value: 'ROLE_MODERATOR', viewValue: 'MODERATOR'},
    {value: 'ROLE_USER', viewValue: 'USER'}
  ];

  get f() { return this.userForm.controls; }

  onSubmit(action: string) {
    if (this.userForm.valid) {
      if (action == 'Add') {
        this.loginService.signUp(this.userForm.value)
          .subscribe(data => {
            this.notificationService.success('Successful', 'INSERT');
          },
            error => console.log(error));

      } else {
        if (action == 'Update') {
          this.loginService.updateUser(this.userForm.get('id').value, this.userForm.value)
            .subscribe(data => {
              this.snack = this.notificationService.success('Successful', 'UPDATE');
            });

        } else {
          this.notificationService.error('Error: no valid action', 'ACTION');
        }
      }
    }
    this.onClose();
  }

  onClose() {
    this.userForm.reset();
    this.dialogRef.close();
  }

}
