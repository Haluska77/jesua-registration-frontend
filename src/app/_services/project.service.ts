import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';


export class Project {
  id: number;
  shortName: string;
  // description: string;
  // created: any;
  // active: boolean;
}

@Injectable({
  providedIn: 'root'
})

export class ProjectService {

  private baseUrl = environment.baseUrl + 'projects/';

  projectList: Project[] = [];

  constructor(private http: HttpClient) {
  }

  getProjects(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
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

}
