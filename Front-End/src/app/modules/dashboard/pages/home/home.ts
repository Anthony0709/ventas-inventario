import { Component } from '@angular/core';
import { ChartConfiguration, ChartType } from 'chart.js';
import { DashboardService} from '../../../../services/dashboard.service';
import { HttpClient } from '@angular/common/http';

declare const Chart: any; // Chart.js desde CDN


@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

  summary: any = {};
  products: any[] = [];
  stores: any[] = [];
  year = new Date().getFullYear();
  private chart: any;

  private API = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadSummary();
    this.loadProducts();
    this.loadStores();
  }

  ngAfterViewInit(): void {
    this.loadMonthly();
  }

  ngOnDestroy(): void {
    if (this.chart) this.chart.destroy();
  }

  loadSummary(): void {
    this.http.get(`${this.API}/metrics/summary`).subscribe(res => this.summary = res);
  }

  loadMonthly(): void {
    this.http.get<any[]>(`${this.API}/metrics/sales/monthly?year=${this.year}`)
      .subscribe(points => {
        const labels = points.map(p => p.month);
        const ventas = points.map(p => p.ventas);
const compras = points.map(p => p.compras);

        const ctx = (document.getElementById('salesChart') as HTMLCanvasElement).getContext('2d');
        if (this.chart) this.chart.destroy();
        this.chart = new Chart(ctx, {
          type: 'line',
          data: {
            labels,
            datasets: [
              { label: 'Ventas', data: ventas, borderColor: '#007bff', tension: 0.3 },
              { label: 'Compras', data: compras, borderColor: '#dc3545', tension: 0.3 }
            ]
          },
          options: {
            responsive: true,
            plugins: { legend: { position: 'top' } },
            scales: { y: { beginAtZero: true } }
          }
        });
      });
  }

  loadProducts(): void {
    this.http.get<any[]>(`${this.API}/products/`)
      .subscribe(res => this.products = res.slice(0, 8));
  }

  loadStores(): void {
    this.http.get<any[]>(`${this.API}/stores/`)
      .subscribe(res => this.stores = res.slice(0, 8));
  }

  refreshYear(delta: number): void {
this.year += delta;
    this.loadMonthly();
  }
}
