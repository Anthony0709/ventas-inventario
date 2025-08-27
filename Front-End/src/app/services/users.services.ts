import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class UsersService {
   private API = 'http://127.0.0.1:8000'; // Ajusta según tu backend

  constructor(private http: HttpClient) {}

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API}/`);
  }

  create(user: any): Observable<any> {
    return this.http.post<any>(`${this.API}/`, user);
  }

  update(id: number, user: any): Observable<any> {
    return this.http.put<any>(`${this.API}/${id}`, user);
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.API}/${id}`);
  }
}
