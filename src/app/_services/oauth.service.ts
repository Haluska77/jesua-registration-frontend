import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {environment} from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OauthService {

  baseUrl = environment.baseUrl;
  authorizationEndpoint = 'oauth2/authorization/google';
  private tokenEndpoint = 'login/oauth2/code/google';
  private userInfoEndpoint = 'oauth2/user';

  constructor(private http: HttpClient) { }

  
  getGoogleAuthorization(): Observable<object> {    
    return this.http.get(this.baseUrl + this.authorizationEndpoint);
  }

  getOauthToken(code, state): Observable<object> {
    const params = new HttpParams()
    .set("code", code)
    .set("state", state);
    
    return this.http.get(this.baseUrl + this.tokenEndpoint, {params});
  }
    
  getOauthUser(): Observable<object> {
    return this.http.get(this.baseUrl + this.userInfoEndpoint);
    // .pipe(
    //   map((data: any) => data.response.body)
    // );
  }
}
