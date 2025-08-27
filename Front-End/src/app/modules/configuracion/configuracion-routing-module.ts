import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Configuracion } from './pages/configuracion/configuracion';

const routes: Routes = [
  {path: '',component: Configuracion}, // Assuming ConfiguracionComponent is the main component for this module
  // Add other routes specific to Configuracion module here if needed
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfiguracionRoutingModule { }
