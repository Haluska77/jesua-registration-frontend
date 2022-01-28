import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {environment} from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OauthService {

  baseUrl = environment.baseUrl;
  authorizationEndpoint = 'oauth2/authorization/google';
  private userInfoEndpoint = 'oauth2/user';

  constructor(private http: HttpClient) { }

  getOauthUser(): Observable<object> {
    return this.http.get(this.baseUrl + this.userInfoEndpoint);
    // .pipe(
    //   map((data: any) => data.response.body)
    // );
  }
}
