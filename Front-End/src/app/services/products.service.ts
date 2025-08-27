import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, ProductCreate } from '../models/product.model';



@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private API = 'http://127.0.0.1:8000/products';

  constructor(private http: HttpClient) {}

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API}/`);
  }

  get(id: number): Observable<any> {
    return this.http.get<any>(`${this.API}/${id}`);
  }

  create(data: any): Observable<any> {
    return this.http.post<any>(`${this.API}/`, data);
  }

  update(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.API}/${id}`, data);
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.API}/${id}`);
  }
}
