import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from 'src/environments/environment';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {DatePipe} from '@angular/common';
import {TokenService} from './token.service';

@Injectable({
  providedIn: 'root'
})

export class EventService {

  private baseUrl = environment.baseUrl + 'events/';

  constructor(private http: HttpClient,
              private datePipe: DatePipe,
              private tokenService: TokenService) {
  }

  eventForm = new FormGroup({
    id: new FormControl(),
    userId: new FormControl(),
    project: new FormControl(null, [Validators.required]),
    description: new FormControl(null, [Validators.required]),
    startDate: new FormControl(null, [Validators.required]),
    open: new FormControl(),
    capacity: new FormControl(null, [Validators.required]),
    image: new FormControl()
  });

  fillEvent(event: any): void {
    event.startDate = this.datePipe.transform(event.startDate, 'yyyy-MM-ddTHH:mm', 'Europe/Bratislava');
    this.eventForm.patchValue(event);
  }

  getEventListByProjects(): Observable<any> {
    return this.http.get(`${this.baseUrl}` + 'eventListByUserProject/' + this.tokenService.user.id);
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
      projectId: course.project.id
    });
  }

}
