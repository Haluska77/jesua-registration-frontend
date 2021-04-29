import {Component, OnInit} from '@angular/core';
import {TokenService} from '../../_services/token.service';
import {MatDialog} from '@angular/material/dialog';
import {ProjectDialogFormComponent} from '../../project/project-dialog-form/project-dialog-form.component';
import {UserDialogFormComponent} from '../user-dialog-form/user-dialog-form.component';
import {ProjectService} from '../../_services/project.service';


@Component({
  selector: 'app-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  loggedUser: any;
  isAuthorized: boolean;
  projectSize: number;

  constructor(private token: TokenService,
              private projectService: ProjectService,
              private dialog: MatDialog) {
  }

  ngOnInit() {
    this.loggedUser = this.token.getUser();
    if (!!this.loggedUser) {
      this.projectSize = this.loggedUser.projects.length;
      this.isAuthorized = true;
    } else {
      this.isAuthorized = false;
    }
  }

  onEditUser(user: any) {
    this.dialog.open(UserDialogFormComponent, {
      width: '400px',
      disableClose: false,
      autoFocus: true,
      panelClass: 'myapp-dialog',
      data: {action: 'Update', user}
    });
  }

  openProjectDialog(action: string): void {
    this.dialog.open(ProjectDialogFormComponent, {
      width: '400px',
      disableClose: false,
      autoFocus: true,
      panelClass: 'myapp-dialog',
      data: { action }
    });
  }

  onCreateProject(): void {
    this.openProjectDialog('Add');
  }

  onEditProject(project: any): void {
    this.projectService.fillProject(project);
    this.openProjectDialog('Update');
  }
}
