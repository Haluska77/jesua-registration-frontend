import {Component, OnInit} from '@angular/core';
import {PasswordService} from '../password.service';
import {DialogService} from '../../_services/dialog.service';

@Component({
  selector: 'app-password-account-form',
  templateUrl: './password-account-form.component.html',
  styleUrls: ['./password-account-form.component.css']
})
export class PasswordAccountFormComponent implements OnInit {

  constructor(public passwordService: PasswordService,
              private dialogService: DialogService) { }

  isLoginFailed = false;
  errorMessage: string;

  get f() { return this.passwordService.passwordAccountForm.controls; }

  ngOnInit(): void {
  }

  sendEmail() {

    this.passwordService.getUserAccount(this.passwordService.passwordAccountForm.get('email').value)
      .subscribe((data: any) => {
        this.isLoginFailed = false;
        this.dialogService.openSuccessResponseDialog('Akceptovaný', data.response.message, '../home');
        this.passwordService.passwordAccountForm.reset();
      },
      (err) => {
        this.isLoginFailed = true;
        this.errorMessage = err.error.error.message;
      }
    );
  }
}
