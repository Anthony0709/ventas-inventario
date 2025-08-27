import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Entradas } from './pages/entradas/entradas';

const routes: Routes = [
  {path: '',component: Entradas}, // Assuming EntradasPage is the main component for this module
  // Add other routes specific to Entradas module here if needed
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EntradasRoutingModule { }
