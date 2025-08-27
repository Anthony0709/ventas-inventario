import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EntradasRoutingModule } from './entradas-routing-module';
import { Entradas } from './pages/entradas/entradas';



@NgModule({
  declarations: [
    Entradas,
    
  ],
  imports: [
    CommonModule,
    EntradasRoutingModule
  ]
})
export class EntradasModule { }
