import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {TokenService} from './token.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';


export class Project {
  id: number;
  shortName: string;
}

@Injectable({
  providedIn: 'root'
})

export class ProjectService {

  private baseUrl = environment.baseUrl + 'projects/';

  constructor(private http: HttpClient,
              private tokenService: TokenService) {
  }

  user = this.tokenService.getUser();

  projectForm = new FormGroup({
    id: new FormControl(''),
    userId: new FormControl(this.user.id),
    shortName: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(8)]),
    description: new FormControl('', [Validators.required, Validators.minLength(8)]),
    active: new FormControl()
  });

  fillProject(project: any): void {
    this.projectForm.patchValue(project);
  }

  getProjects(): Observable<any> {
    const params = new HttpParams()
      .set('userId', this.user.id);
    return this.http.get(`${this.baseUrl}`, {params});
  }

  getProjectList(): Observable<Project> {
    return this.getProjects()
      .pipe(
        map(data => data.response.body
          .map(item => {
              const project = new Project();
              project.id = item.id;
              project.shortName = item.shortName;
              return project;
            }
          )
        )
      );
  }

  addProject(userId: any, project: any): Observable<object> {

    return this.http.post(`${this.baseUrl}` + 'add/' + userId, {
      shortName: project.shortName,
      description: project.description,
      active: project.active
    });
  }

  updateProject(id: any, project: any): Observable<object> {

    return this.http.post(`${this.baseUrl}` + 'update/' + id, {
      shortName: project.shortName,
      description: project.description,
      active: project.active
    });
  }
}
