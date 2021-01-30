import { Component, Inject, Optional } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CustomValidators } from '../custom-validators';
import { LoginService } from '../_services/login.service';
import { NotificationService } from '../_services/notification.service';

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

  emailPattern = new RegExp("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$");
  passwordDigitPattern = new RegExp("[0-9]");
  passwordLowerCasePattern = new RegExp("[a-z]");
  passwordUpperCasePattern = new RegExp("[A-Z]");

  snack: any;

  userForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required,
    CustomValidators.patternValidator(this.emailPattern, { emailValid: true })]],
    password: ['', [
      Validators.required,
      Validators.minLength(8),
      CustomValidators.patternValidator(this.passwordDigitPattern, { hasNumber: true }),
      CustomValidators.patternValidator(this.passwordLowerCasePattern, { hasSmallChars: true }),
      CustomValidators.patternValidator(this.passwordUpperCasePattern, { hasBigChars: true })
    ]],
    confirmPassword: ['', [Validators.required]],
    role: ['', [Validators.required]]
  }, {
    validator: CustomValidators.mustMatch('password', 'confirmPassword')
  });


  get f() { return this.userForm.controls; }

  onSubmit(action: string) {
    if (this.userForm.valid) {
      if (action == 'Add') {
        this.loginService.signUp(this.userForm.value)
          .subscribe(data => {
            this.notificationService.success("Successfull", "INSERT");
          },
            error => console.log(error));

      } else {
        if (action == 'Update') {
          this.loginService.updateUser(this.userForm.get('id').value, this.userForm.value)
            .subscribe(data => {
              this.snack = this.notificationService.success("Successfull", "UPDATE");
            },
              error => console.log(error));

        } else {
          this.notificationService.error("Error: no valid action", "ACTION");
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
