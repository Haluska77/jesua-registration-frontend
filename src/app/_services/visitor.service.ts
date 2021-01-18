import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface RegisterForm {
  fname: string;
  email: string;
};

@Injectable({
  providedIn: 'root'
})
export class VisitorService {

  constructor(private http: HttpClient) { }

  private baseUrl = environment.baseUrl+'registration/';

  getVisitorList(): Observable<any> {
    return this.http.get(`${this.baseUrl}`+'');
  }

  unsubscribe(token, eventId): Observable<any> {
    return this.http.get(`${this.baseUrl}`+'unsubscribe?token='+token+'&event='+eventId);
  }

  register(user): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}`+"add",
      {
        name: user.name,
        email: user.email,
        eventId: user.course,
        gdpr: user.gdpr
      }
);

  }
}
