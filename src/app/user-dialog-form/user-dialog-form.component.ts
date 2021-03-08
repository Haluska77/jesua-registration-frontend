import {Component, Inject, OnInit, Optional} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {LoginService} from '../_services/login.service';
import {NotificationService} from '../_services/notification.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CustomValidators} from '../custom-validators';

@Component({
  selector: 'app-user-dialog-form',
  templateUrl: './user-dialog-form.component.html',
  styleUrls: ['./user-dialog-form.component.css']
})

export class UserDialogFormComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    public loginService: LoginService,
    private notificationService: NotificationService,
    public dialogRef: MatDialogRef<UserDialogFormComponent>,
    @Optional()
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  snack: any;
  hidePassword = true;

  userForm: FormGroup;

  ngOnInit(): void {
    this.makeForm(this.data);
  }

  makeForm(data: any) {

    // add
    this.userForm = this.formBuilder.group({
      id: [''],
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required,
        CustomValidators.validateEmailPattern()]],
      password: [{value: '', disabled: false}, [
        Validators.required,
        Validators.minLength(8),
        CustomValidators.containsAtLeastOneNumber(),
      ]],
      role: ['', [Validators.required]],
      active: ['']
    });

    // update
    if (data.action === 'Update') {
      this.userForm.setControl('email', this.formBuilder.control({value: '', disabled: true}));
      this.userForm.setControl('password', this.formBuilder.control({value: '', disabled: true}));

      this.userForm.patchValue(this.data.user);

    }
  }


  get f() {
    return this.userForm.controls;
  }

  onSubmit(action: string) {
    if (this.userForm.valid) {
      if (action === 'Add') {
        this.loginService.signUp(this.userForm.value)
          .subscribe(data => {
              this.notificationService.success('Successful', 'INSERT');
            },
            error => console.log(error));

      } else {
        if (action === 'Update') {
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
