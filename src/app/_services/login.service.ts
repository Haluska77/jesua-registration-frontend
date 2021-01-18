import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})

export class LoginService {

  private baseUrl = environment.baseUrl+'users/';

  constructor(private http: HttpClient) { }

  signIn(login: object): Observable<object> {
    return this.http.post(`${this.baseUrl}`+'signin', login, httpOptions);
  }

  
  signUp(user): Observable<any> {
    return this.http.post(`${this.baseUrl}` + 'signup', {
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role
    }, httpOptions);
  }

  userForm(): Observable<any> {
    return this.http.get(`${this.baseUrl}`+'userForm', {responseType: 'text'});
  }

  getUsers(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  makeActive(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}`+'makeActive?userId='+id);
  }

  loggedIn() {
    return !!sessionStorage.getItem('auth-token')
  }
}
