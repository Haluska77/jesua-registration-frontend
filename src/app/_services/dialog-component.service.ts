import {Injectable} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Project} from './project.service';
import {UploadFileComponent} from '../file/upload-file/upload-file.component';
import {ProjectDialogFormComponent} from '../project/project-dialog-form/project-dialog-form.component';
import {UserDialogFormComponent} from '../user/user-dialog-form/user-dialog-form.component';

@Injectable({
  providedIn: 'root'
})
export class DialogComponentService {

  constructor(private dialog: MatDialog) { }

  openUploadFileComponent(project: number): void {
    this.dialog.open(UploadFileComponent, {
      width: '400px',
      disableClose: false,
      autoFocus: true,
      panelClass: 'myapp-dialog',
      data: {project}
    });
  }

  openProjectDialogComponent(action: string, project: Project): void {
    this.dialog.open(ProjectDialogFormComponent, {
      width: '400px',
      disableClose: false,
      autoFocus: true,
      panelClass: 'myapp-dialog',
      data: {action, project}
    });
  }

  openUserDialogComponent(title: string, user: any): void {
    this.dialog.open(UserDialogFormComponent, {
      width: '400px',
      disableClose: false,
      autoFocus: true,
      panelClass: 'myapp-dialog',
      data: {action: title, user}
    });
  }
}
