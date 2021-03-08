import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from 'src/environments/environment';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {CustomValidators} from '../custom-validators';

@Injectable({
  providedIn: 'root'
})

export class VisitorService {

  constructor(private http: HttpClient) { }

  private baseUrl = environment.baseUrl + 'registration/';

  registerForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, CustomValidators.validateEmailPattern()]),
    course: new FormControl('', [Validators.required]),
    gdpr: new FormControl()
  });

  getVisitorList(): Observable<any> {
    return this.http.get(`${this.baseUrl}` + '');
  }

  unsubscribe(token, eventId): Observable<any> {
    const params = new HttpParams()
      .set('token', token)
      .set('event', eventId);
    return this.http.get(`${this.baseUrl}` + 'unsubscribe', {params});
  }

  register(user): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}` + 'add',
      {
        name: user.name,
        email: user.email,
        eventId: user.course,
        gdpr: user.gdpr
      }
);

  }
}
