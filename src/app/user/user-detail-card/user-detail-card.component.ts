import {Component, Input, OnInit} from '@angular/core';
import {DialogService} from '../../_services/dialog.service';
import {LoginService} from '../../_services/login.service';
import {TokenService} from '../../_services/token.service';
import {DialogComponentService} from "../../_services/dialog-component.service";

@Component({
  selector: 'app-user-detail-card',
  templateUrl: './user-detail-card.component.html',
  styleUrls: ['./user-detail-card.component.css']
})
export class UserDetailCardComponent implements OnInit {
  @Input() user: any;

  loggedUserId: string;

  constructor(    private loginService: LoginService,
                  private dialogService: DialogService,
                  private tokenService: TokenService,
                  private dialogComponentService: DialogComponentService) {
  }

  ngOnInit(): void {
    this.loggedUserId = this.tokenService.user.id;
  }

  onEdit(row: any): void {
    this.dialogComponentService.openUserDialogComponent('Update', row);
  }

  makeActive(id: number, userName: string): void {
    this.dialogService.openConfirmDialog('Are you sure to change status for ' + userName + '?')
      .afterClosed().subscribe(data => { // returns true
          if (data) {
            this.loginService.makeActive(id)
              .subscribe(value => {
                this.dialogService.openSuccessResponseDialog('Zmenený', value.response.message, '../users');

              });
          }
        }
      );
  }
}
