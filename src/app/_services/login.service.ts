import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})

export class LoginService {

  private baseUrl = environment.baseUrl + 'users/';

  constructor(private http: HttpClient) { }

  signIn(login: object): Observable<object> {
    return this.http.post(`${this.baseUrl}` + 'signin', login, httpOptions);
  }


  signUp(user): Observable<any> {
    return this.http.post(`${this.baseUrl}` + 'signup', {
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role
    }, httpOptions);
  }

  updateUser(id: number, user: any): Observable<any> {
    const params = new HttpParams()
      .set('id', String(id));
    return this.http.post(`${this.baseUrl}` + 'update', {
      user
    }, {params});
  }

  getUsers(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  makeActive(id: number): Observable<any> {
    const params = new HttpParams()
      .set('userId', String(id));
    return this.http.get(`${this.baseUrl}` + 'makeActive', {params});
  }

  loggedIn() {
    return !!sessionStorage.getItem('auth-token');
  }
}
