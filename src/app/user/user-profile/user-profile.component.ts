import {Component, OnInit, ViewChild} from '@angular/core';
import {JwtUserDetail, TokenService} from '../../_services/token.service';
import {MatDialog} from '@angular/material/dialog';
import {ProjectService} from '../../_services/project.service';
import {FileListComponent} from '../../file/file-list/file-list.component';
import {DialogComponentService} from '../../_services/dialog-component.service';
import { FormAction } from 'src/app/_services/dialog.service';

@Component({
  selector: 'app-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  @ViewChild('fileList')
  private fileList: FileListComponent;

  loggedUser: JwtUserDetail;
  isAuthorized: boolean;
  projectSize: number;

  constructor(private tokenService: TokenService,
              private projectService: ProjectService,
              private dialog: MatDialog,
              private dialogComponentService: DialogComponentService) {
  }

  ngOnInit() {
    this.loggedUser = this.tokenService.user;
    if (!!this.loggedUser) {
      this.projectSize = this.loggedUser.projects.length;
      this.isAuthorized = true;
    } else {
      this.isAuthorized = false;
    }
  }

  onEditUser(user: any) {
    this.dialogComponentService.openUserDialogComponent(FormAction.UPDATE, user);
  }

  onCreateProject(): void {
    this.dialogComponentService.openProjectDialogComponent(FormAction.ADD, null);
  }

  onEditProject(project: any): void {
    this.dialogComponentService.openProjectDialogComponent(FormAction.UPDATE, project);
  }

  onAddImage(project: number): void {
    this.dialogComponentService.openUploadFileComponent(project);
  }
}
