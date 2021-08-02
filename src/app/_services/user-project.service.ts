import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Project} from './project.service';

export enum ProjectRole {
  Owner = 'OWNER',
  User = 'USER',
}

export interface User {
  id: string;
  avatar: string;
  name: string;
  email: string;
  role: string;
  active: boolean;
  created: string;
}

export class UserProjectDetail {
  user: User;
  role: ProjectRole;
  created: string;
}

export class ProjectDetail {
  project: Project;
  users: UserProjectDetail[];
}

export class UserProjectId {
  project: number;
  user: string;
  role: ProjectRole;
  created: string;
}

export class ProjectDetailExt {
  project: Project;
  users: UserProjectDetail[];
  projectOwner: boolean;
  projectUser: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UserProjectService {

  private baseUrl = environment.baseUrl + 'userProjects/';

  constructor(private http: HttpClient) {
  }

  getUserProjectsList(): Observable<ProjectDetail[]> {
    return this.http.get(`${this.baseUrl}`)
      .pipe(
        map((data: any) => data.response.body)
      );
  }

  getUserProjectDetailByProject(projectId: number): Observable<ProjectDetail> {
    return this.http.get(`${this.baseUrl}` + 'project/' + projectId)
      .pipe(
        map((data: any) => data.response.body)
      );
  }

  getUserProjectIdList(): Observable<any> {
    return this.http.get(`${this.baseUrl}` + 'list');
  }
}
