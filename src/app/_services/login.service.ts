import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface Role {
  value: any;
  viewValue: string;
}

export enum UserRole {
  ROLE_ADMIN = 'ROLE_ADMIN',
  ROLE_MODERATOR = 'ROLE_MODERATOR',
  ROLE_USER = 'ROLE_USER'
}

@Injectable({
  providedIn: 'root'
})

export class LoginService {

  private baseUrl = environment.baseUrl + 'users/';

  constructor(private http: HttpClient) {
  }

  roles: Role[] = [
    { value: UserRole.ROLE_ADMIN, viewValue: 'ADMIN' },
    { value: UserRole.ROLE_MODERATOR, viewValue: 'MODERATOR' },
    { value: UserRole.ROLE_USER, viewValue: 'USER' }
  ];

  signIn(login: object): Observable<object> {
    return this.http.post(`${this.baseUrl}` + 'signin', login);
  }

  signUp(user): Observable<any> {
    return this.http.post(`${this.baseUrl}` + 'signup', {
      avatar: user.avatar,
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role,
      active: user.active
    });
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
    return this.http.get(`${this.baseUrl}` + 'makeActive', { params });
  }

  // currently not available in backend
  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}` + 'deleteUser/' + `${id}`);
  }
}
