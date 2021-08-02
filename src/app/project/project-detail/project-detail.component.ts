import {Component, OnInit} from '@angular/core';
import {ProjectDetail, ProjectRole, UserProjectService} from '../../_services/user-project.service';
import {ActivatedRoute} from '@angular/router';
import {Project} from '../../_services/project.service';
import {TokenService} from '../../_services/token.service';
import {tap} from 'rxjs/operators';
import {DialogService} from '../../_services/dialog.service';
import {DialogComponentService} from '../../_services/dialog-component.service';

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.css']
})
export class ProjectDetailComponent implements OnInit {

  result: ProjectDetail;
  userIsProjectOwner = false;
  errorMessage: string;

  constructor(private userProjectService: UserProjectService,
              private tokenService: TokenService,
              private dialogService: DialogService,
              private dialogComponentService: DialogComponentService,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    const projectId = Number(this.route.snapshot.paramMap.get('projectId'));

    this.userProjectService.getUserProjectDetailByProject(projectId)
      .pipe(
        tap(projectDetail => {
          const myUserProjectRole = projectDetail.users.find(obj => obj.user.id === this.tokenService.user.id);
          if (myUserProjectRole) {
            this.userIsProjectOwner = myUserProjectRole.role === ProjectRole.Owner;
          }
        })
      )
      .subscribe(data => {
        this.result = data;
      },
        error => {
        this.errorMessage = error.error.error.message;
        });
  }


  onEditProject(project: Project): void {
    this.dialogComponentService.openProjectDialogComponent('Update', project);
  }
}
