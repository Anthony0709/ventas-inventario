import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface VentaPorMes {
  mes: string;
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = 'http://localhost:8000/dashboard';

  constructor(private http: HttpClient) {}

  getVentasPorMesFiltrado(start: string, end: string): Observable<VentaPorMes[]> {
    return this.http.get<VentaPorMes[]>(
      `${this.apiUrl}/ventas-por-mes-filtrado?start=${start}&end=${end}`
    );
  }
}