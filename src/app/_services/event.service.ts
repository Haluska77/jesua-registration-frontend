import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class EventService {

  private baseUrl = environment.baseUrl+'events/';

  constructor(private http:HttpClient) { }

  getEventList(): Observable<any> {
    return this.http.get(`${this.baseUrl}`+'eventList');
  }

  getActiveEventList(): Observable<any> {
    return this.http.get(`${this.baseUrl}`+'activeEventList');
  }

  createEvent(event: object): Observable<object> {
    return this.http.post(`${this.baseUrl}`+'addEvent', event);
  }

  deleteEvent(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}`+'deleteEvent/'+`${id}`);
  }

  getEvent(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}`+'event/'+`${id}`);
  }

  updateEvent(id: number, value: object): Observable<Object> {
    return this.http.post(`${this.baseUrl}`+'updateEvent/'+`${id}`, value);
  }
  
}                                           
