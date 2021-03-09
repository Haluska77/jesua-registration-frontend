import {Component, Inject, OnDestroy, OnInit, Optional} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {LoginService} from '../_services/login.service';
import {NotificationService} from '../_services/notification.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CustomValidators} from '../custom-validators';
import {UserAvatarListComponent} from '../user-avatar-list/user-avatar-list.component';
import {Subscription} from "rxjs";

@Component({
  selector: 'app-user-dialog-form',
  templateUrl: './user-dialog-form.component.html',
  styleUrls: ['./user-dialog-form.component.css']
})

export class UserDialogFormComponent implements OnInit, OnDestroy {

  constructor(
    private formBuilder: FormBuilder,
    public loginService: LoginService,
    private notificationService: NotificationService,
    private dialog: MatDialog,
    private avatarRef: MatDialogRef<UserAvatarListComponent>,
    private dialogRef: MatDialogRef<UserDialogFormComponent>,
    @Optional()
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  snack: any;
  hidePassword = true;

  userForm: FormGroup;
  avatarValue: string;
  avatarSub$: Subscription;

  ngOnInit(): void {
    this.makeForm(this.data);
  }

  makeForm(data: any): void {

    // add
    this.userForm = this.formBuilder.group({
      id: [''],
      avatar: ['001-default.svg'],
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
    this.avatarValue = this.userForm.controls.avatar.value;

    // update
    if (data.action === 'Update') {
      this.userForm.setControl('email', this.formBuilder.control({value: '', disabled: true}));
      this.userForm.setControl('password', this.formBuilder.control({value: '', disabled: true}));

      this.userForm.patchValue(this.data.user);
      this.avatarValue = this.data.user.avatar;

    }
  }


  get f() {
    return this.userForm.controls;
  }

  onListAvatar(avatar: string): void {
    this.avatarRef = this.dialog.open(UserAvatarListComponent, {
      width: '660px',
      disableClose: false,
      autoFocus: true,
      panelClass: 'myapp-dialog',
      position: {top: '50px', right: '50px'},
      data: {avatar}
    });

    this.avatarSub$ = this.avatarRef.afterClosed().subscribe(
      data => {
        this.avatarValue = data;
        this.userForm.patchValue({avatar: this.avatarValue});
      }
    );
    this.avatarSub$ = this.avatarRef.backdropClick().subscribe(
      data => {
        this.avatarRef.close(this.avatarValue);
      }
    );
    this.avatarSub$ = this.avatarRef.keydownEvents().subscribe(
      data => {
        this.avatarRef.close(this.avatarValue);
      }
    );
  }

  onSubmit(action: string): void {
    if (this.userForm.valid) {
      if (action === 'Add') {
        this.loginService.signUp(this.userForm.value)
          .subscribe(data => {
              this.notificationService.success('Successful', 'INSERT');
            },
            error => console.log(error));

      } else {
        if (action === 'Update') {
          console.log(JSON.stringify(this.userForm.value));
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

  ngOnDestroy(): void {
    this.avatarSub$.unsubscribe();
  }
}
