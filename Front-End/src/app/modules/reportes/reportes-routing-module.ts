import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportesPage } from './pages/reportes-page/reportes-page';

const routes: Routes = [
  {path: '', component : ReportesPage}, // Assuming ReportesComponent is the main component for this module
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportesRoutingModule { }
