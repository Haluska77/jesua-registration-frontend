import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from 'src/environments/environment';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {DatePipe} from '@angular/common';
import {TokenService} from './token.service';
import {Project} from './project.service';

@Injectable({
  providedIn: 'root'
})

export class EventService {

  private baseUrl = environment.baseUrl + 'events/';

  constructor(private http: HttpClient,
              private datePipe: DatePipe,
              private tokenService: TokenService) {
  }

  user = this.tokenService.getUser();
  formProjectList = this.user.projects.map(item => {
    const project = new Project();
    project.id = item.project.id;
    project.shortName = item.project.shortName;
    return project;
  });

  projectIds: number[] = [];

  eventForm = new FormGroup({
    id: new FormControl(''),
    userId: new FormControl(this.user.id),
    project: new FormControl(this.formProjectList, [Validators.required]),
    description: new FormControl('', [Validators.required]),
    startDate: new FormControl('', [Validators.required]),
    open: new FormControl(),
    capacity: new FormControl('', [Validators.required]),
    image: new FormControl()
  });

  fillEvent(event: any): void {
    event.startDate = this.datePipe.transform(event.startDate, 'yyyy-MM-ddTHH:mm', 'Europe/Bratislava');
    this.eventForm.patchValue(event);
  }

  getEventListByProjects(): Observable<any> {
    const userProjectsIds = this.tokenService.getUserProjectsIds();

    const params = new HttpParams()
      .set('projectList', String(userProjectsIds));
    return this.http.get(`${this.baseUrl}` + 'eventList', {params});
  }

  createEvent(course: any): Observable<object> {

    return this.http.post(`${this.baseUrl}` + 'addEvent', {
      description: course.description,
      startDate: course.startDate,
      open: course.open,
      capacity: course.capacity,
      userId: course.userId,
      image: course.image,
      projectId: course.project
    });
  }

  deleteEvent(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}` + 'deleteEvent/' + `${id}`);
  }

  updateEvent(id: number, course: any): Observable<any> {
    return this.http.post(`${this.baseUrl}` + 'updateEvent/' + `${id}`, {
      description: course.description,
      startDate: course.startDate,
      open: course.open,
      image: course.image,
      projectId: course.project
    });
  }

}
