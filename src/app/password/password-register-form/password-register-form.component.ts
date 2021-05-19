import {Component, OnInit} from '@angular/core';
import {PasswordService} from '../password.service';
import {DialogService} from '../../_services/dialog.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-password-register-form',
  templateUrl: './password-register-form.component.html',
  styleUrls: ['./password-register-form.component.css']
})
export class PasswordRegisterFormComponent implements OnInit {

  constructor(public passwordService: PasswordService,
              private dialogService: DialogService,
              private route: ActivatedRoute) {
  }

  isValidated = false;
  token: string;
  newHidePassword = true;
  confirmHidePassword = true;

  get f() {
    return this.passwordService.passwordResetForm.controls;
  }

  ngOnInit(): void {
    this.token = this.route.snapshot.paramMap.get('token');
    this.passwordService.validateToken(this.token)
      .subscribe(() => {
        this.isValidated = true;
        this.passwordService.passwordResetForm.patchValue({token: this.token});
      },
      (err) => {
        this.isValidated = false;
        this.dialogService.openErrorResponseDialog('Not accepted', err.error.error.message, '../home');
      }
    );
  }

  resetPassword() {
    this.passwordService.changePassword(this.passwordService.passwordResetForm.value)
      .subscribe((data: any) => {
        this.dialogService.openSuccessResponseDialog('Zmenený', data.response.message, '../login');
      },
      (err) => {
        this.dialogService.openErrorResponseDialog('Not accepted', err.error.error.message, '../home');
      }
    );

  }
}
