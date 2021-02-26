import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from 'src/environments/environment';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {DatePipe} from '@angular/common';

@Injectable({
  providedIn: 'root'
})

export class EventService {

  private baseUrl = environment.baseUrl+'events/';

  constructor(private http: HttpClient,
       private datePipe: DatePipe) { }

  eventForm = new FormGroup({
    id: new FormControl('', ),
    description: new FormControl('', [Validators.required]),
    startDate: new FormControl('', [Validators.required]),
    open: new FormControl(),
    capacity: new FormControl('', [Validators.required])
  });

  fillEvent(event: any) {
    event.startDate = this.datePipe.transform(event.startDate, 'yyyy-MM-ddTHH:mm', 'Europe/Bratislava');
    this.eventForm.setValue(event);

  }

  getEventList(): Observable<any> {
    return this.http.get(`${this.baseUrl}`+'eventList');
  }

  getActiveEventList(): Observable<any> {
    return this.http.get(`${this.baseUrl}`+'activeEventList');
  }

  createEvent(course: any): Observable<object> {
    console.log(this.baseUrl);
    return this.http.post(`${this.baseUrl}`+'addEvent', {
      description: course.description,
      startDate: course.startDate,
      open: course.open,
      capacity: course.capacity
    });
  }

  deleteEvent(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}`+'deleteEvent/'+`${id}`);
  }

  updateEvent(id: number, value: object): Observable<Object> {
    return this.http.post(`${this.baseUrl}`+'updateEvent/'+`${id}`, value);
  }

}
