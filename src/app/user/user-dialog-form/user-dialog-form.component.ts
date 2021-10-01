import {Component, Inject, OnInit, Optional} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {LoginService, Role, UserRole} from '../../_services/login.service';
import {NotificationService} from '../../_services/notification.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CustomValidators} from '../../custom-validators';
import {UserAvatarListComponent} from '../user-avatar-list/user-avatar-list.component';
import {Subscription} from 'rxjs';
import {JwtUserDetail, TokenService} from '../../_services/token.service';
import { FormAction } from 'src/app/_services/dialog.service';

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
    private tokenService: TokenService,
    private dialog: MatDialog,
    private avatarRef: MatDialogRef<UserAvatarListComponent>,
    private dialogRef: MatDialogRef<UserDialogFormComponent>,
    @Optional()
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  hidePassword = true;

  userForm: FormGroup;
  avatarValue: string;
  avatarSub$: Subscription;
  loggedUser: JwtUserDetail = this.tokenService.user;
  roleList: Role[] = [];

  ngOnInit(): void {
    this.makeForm(this.data);
  }

  makeForm(formUser: any): void {

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

    if (this.loggedUser.role === UserRole.ROLE_ADMIN) {
      this.roleList = this.loginService.roles;
    } else {
      const myRole = this.loginService.roles.filter(a => a.value === formUser.user.role)[0];
      this.roleList.push({value: myRole.value, viewValue: myRole.viewValue});
    }

    this.avatarValue = this.userForm.controls.avatar.value;

    // update
    if (formUser.action === FormAction.UPDATE) {
      this.userForm.controls.email.disable();
      this.userForm.controls.password.disable();

      // MODERATOR user is not able to change his role and active
      if (this.loggedUser.role === UserRole.ROLE_MODERATOR) {
        this.userForm.controls.active.disable();
      }

      // to prevent deactive current ADMIN user
      if (formUser.user.role === UserRole.ROLE_ADMIN && formUser.user.id === this.loggedUser.id) {
        this.userForm.setControl('active', this.formBuilder.control({value: '', disabled: true}));
      }
      this.userForm.patchValue(formUser.user);
      this.avatarValue = formUser.user.avatar;
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
      () => {
        this.avatarRef.close(this.avatarValue);
      }
    );
    this.avatarSub$ = this.avatarRef.keydownEvents().subscribe(
      () => {
        this.avatarRef.close(this.avatarValue);
      }
    );
  }

  onSubmit(action: string): void {
    if (this.userForm.valid) {
      if (action === FormAction.ADD) {
        this.loginService.signUp(this.userForm.value)
          .subscribe(() => {
              this.notificationService.success('Successful', 'INSERT');
            });

      } else {
        if (action === FormAction.UPDATE) {
          this.loginService.updateUser(this.userForm.get('id').value, this.userForm.value)
            .subscribe(data => {
              this.notificationService.success('Successful', 'UPDATE');

              if (data.response.body.id === this.loggedUser.id) {
                this.tokenService.signOut();
              }
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
