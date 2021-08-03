import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {Project} from '../../_services/project.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {ProjectDetailExt, ProjectRole, UserProjectDetail, UserProjectService} from '../../_services/user-project.service';
import {TokenService} from '../../_services/token.service';
import {map} from 'rxjs/operators';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {DialogComponentService} from '../../_services/dialog-component.service';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ProjectListComponent implements OnInit, AfterViewInit {

  constructor(public userProjectService: UserProjectService,
              private tokenService: TokenService,
              private dialogComponentService: DialogComponentService) {
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = ['shortName', 'description', 'created', 'active', 'action'];
  dataSource = new MatTableDataSource<ProjectDetailExt>();
  expandedElement: ProjectDetailExt | null;

  userExtList: UserProjectDetail[];
  projectDetailExt: ProjectDetailExt;
  projectDetailExtList: ProjectDetailExt[] = [];

  ngOnInit(): void {
    this.userProjectService.getUserProjectsList()
      .pipe(
        map(result => {
            result.forEach(projectDetail => {
                this.projectDetailExt = new ProjectDetailExt();
                this.projectDetailExt.projectOwner = false;
                this.projectDetailExt.projectUser = false;
                this.projectDetailExt.project = projectDetail.project;
                this.userExtList = [];
                projectDetail.users.forEach(userProjectDetail => {
                  this.userExtList.push(userProjectDetail);
                  if (userProjectDetail.user.id === this.tokenService.user.id) {
                    this.projectDetailExt.projectOwner = userProjectDetail.role === ProjectRole.Owner;
                    this.projectDetailExt.projectUser = userProjectDetail.role === ProjectRole.User;
                  }
                });
                this.projectDetailExt.users = this.userExtList;
                this.projectDetailExtList.push(this.projectDetailExt);
              }
            );
            return this.projectDetailExtList;
          }
        )
      )
      .subscribe(data => {
        this.dataSource.data = data;
      });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = (item, property) => {
      return item.project[property].toLocaleLowerCase();
    };
  }

  askForJoin(projectId: number) {

  }

  onCreateProject(): void {
    this.dialogComponentService.openProjectDialogComponent('Add', null);
  }

  onEditProject(project: Project): void {
    this.dialogComponentService.openProjectDialogComponent('Update', project);
  }
}
