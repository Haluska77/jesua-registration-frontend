import {Component, OnInit} from '@angular/core';
import {TokenService} from '../../_services/token.service';
import {UserDialogFormComponent} from '../user-dialog-form/user-dialog-form.component';
import {MatDialog} from '@angular/material/dialog';


@Component({
  selector: 'app-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  loggedUser: any;
  isAuthorized: boolean;

  constructor(private token: TokenService,
              private dialog: MatDialog) { }

  ngOnInit() {
    this.loggedUser = this.token.getUser();
    if (!!this.loggedUser) {
      this.isAuthorized = true;
    } else {
      this.isAuthorized = false;
    }
  }

  onEdit(user: any){
    this.dialog.open(UserDialogFormComponent, {
      width: '400px',
      disableClose: false,
      autoFocus: true,
      panelClass: 'myapp-dialog',
      data: {action: 'Update', user}
    });
  }
}
