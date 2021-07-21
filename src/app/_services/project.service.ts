import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

export class Project {
  id: number;
  shortName: string;
}

@Injectable({
  providedIn: 'root'
})

@Injectable()
export class ProjectService {

  private baseUrl = environment.baseUrl + 'projects/';

  constructor(private http: HttpClient) {
  }

  getProjectByName(control: string): Observable<any> {
    const params = new HttpParams()
      .set('name', control);
    return this.http.get(`${this.baseUrl}`, {params});
  }

  getProjectByUser(control: string): Observable<any> {
    const params = new HttpParams()
      .set('userId', control);
    return this.http.get(`${this.baseUrl}`, {params});
  }

  getAllProjectList(): Observable<Project[]> {
    return this.http.get(`${this.baseUrl}`)
      .pipe(
        map((data: any) => data.response.body
          .map(item => {
              return this.createProjectFromItem(item);
            }
          )
        )
      );
  }

  createProjectFromItem(item: any): Project {
    const project = new Project();
    project.id = item.id;
    project.shortName = item.shortName;
    return project;
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
