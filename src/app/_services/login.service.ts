import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

interface Role {
  value: string;
  viewValue: string;
}

@Injectable({
  providedIn: 'root'
})

export class LoginService {

  private baseUrl = environment.baseUrl + 'users/';

  constructor(private http: HttpClient) {
  }

  roles: Role[] = [
    {value: 'ROLE_ADMIN', viewValue: 'ADMIN'},
    {value: 'ROLE_MODERATOR', viewValue: 'MODERATOR'},
    {value: 'ROLE_USER', viewValue: 'USER'}
  ];

  signIn(login: object): Observable<object> {
    return this.http.post(`${this.baseUrl}` + 'signin', login, httpOptions);
  }

  signUp(user): Observable<any> {
    return this.http.post(`${this.baseUrl}` + 'signup', {
      avatar: user.avatar,
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role,
      active: user.active
    }, httpOptions);
  }

  updateUser(id: number, user: any): Observable<any> {
    return this.http.post(`${this.baseUrl}` + 'update/' + id, {
      avatar: user.avatar,
      name: user.name,
      email: user.email,
      role: user.role,
      active: user.active
    });
  }

  getUsers(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  makeActive(id: number): Observable<any> {
    const params = new HttpParams()
      .set('userId', String(id));
    return this.http.get(`${this.baseUrl}` + 'makeActive', {params});
  }

  // currently not available in backend
  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}` + 'deleteUser/' + `${id}`);
  }

  loggedIn(): boolean {
    return !!sessionStorage.getItem('auth-token');
  }
}
