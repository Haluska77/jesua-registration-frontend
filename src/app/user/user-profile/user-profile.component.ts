import {Component, OnInit, ViewChild} from '@angular/core';
import {TokenService} from '../../_services/token.service';
import {MatDialog} from '@angular/material/dialog';
import {ProjectDialogFormComponent} from '../../project/project-dialog-form/project-dialog-form.component';
import {UserDialogFormComponent} from '../user-dialog-form/user-dialog-form.component';
import {ProjectService} from '../../_services/project.service';
import {UploadFileComponent} from '../../file/upload-file/upload-file.component';
import {FileListComponent} from '../../file/file-list/file-list.component';

@Component({
  selector: 'app-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  @ViewChild('fileList')
  private fileList: FileListComponent;

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

  openProjectDialog(action: string, project: any): void {
    this.dialog.open(ProjectDialogFormComponent, {
      width: '400px',
      disableClose: false,
      autoFocus: true,
      panelClass: 'myapp-dialog',
      data: {action, project}
    });
  }

  onCreateProject(): void {
    this.openProjectDialog('Add', null);
  }

  onEditProject(project: any): void {
    this.openProjectDialog('Update', project);
  }

  onAddImage(project: any) {
    this.dialog.open(UploadFileComponent, {
      width: '400px',
      disableClose: false,
      autoFocus: true,
      panelClass: 'myapp-dialog',
      data: {project}
    });
  }

  onShowImagesOnProject(project: number) {
    this.fileList.showFilesByProject(project);
  }
}
