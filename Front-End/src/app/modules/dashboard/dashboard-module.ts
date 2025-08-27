import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing-module';
import { Home } from './pages/home/home';

import { NgChartsModule} from 'ng2-charts';
import { DashboardService } from '../../services/dashboard.service';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    Home
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    FormsModule, // Asegúrate de importar FormsModule si usas ngModel
    NgChartsModule // ✅ esto activa baseChart en canvas

  ],
  providers: [DashboardService]
})
export class DashboardModule { }
