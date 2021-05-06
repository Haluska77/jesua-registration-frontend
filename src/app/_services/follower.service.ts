import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from 'src/environments/environment';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {CustomValidators} from '../custom-validators';
import {DeviceDetectorService} from 'ngx-device-detector';
import {TokenService} from './token.service';

@Injectable({
  providedIn: 'root'
})

export class FollowerService {

  constructor(private http: HttpClient,
              private tokenService: TokenService,
              private deviceDetector: DeviceDetectorService) { }

  private baseUrl = environment.baseUrl + 'registration/';

  registerForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, CustomValidators.validateEmailPattern()]),
    course: new FormControl('', [Validators.required]),
    gdpr: new FormControl(false, [Validators.requiredTrue]),
    device: new FormControl(this.deviceDetector.userAgent)
  });

  user = this.tokenService.getUser();

  getVisitorListByProjects(): Observable<any> {
    const userProjectsIds = this.tokenService.getUserProjectsIds();

    const params = new HttpParams()
      .set('projects', String(userProjectsIds));
    return this.http.get(`${this.baseUrl}`, {params});
  }

  unsubscribe(token, eventId): Observable<any> {
    const params = new HttpParams()
      .set('token', token)
      .set('event', eventId);
    return this.http.get(`${this.baseUrl}` + 'unsubscribe', {params});
  }

  register(visitor): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}` + 'add',
      {
        name: visitor.name,
        email: visitor.email,
        eventId: visitor.course,
        deviceDetail: visitor.device
      }
);

  }
}
