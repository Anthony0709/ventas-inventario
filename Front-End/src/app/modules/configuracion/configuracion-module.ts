import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfiguracionRoutingModule } from './configuracion-routing-module';
import { Configuracion } from './pages/configuracion/configuracion';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    Configuracion
  ],
  imports: [
    CommonModule,
    ConfiguracionRoutingModule,
    FormsModule,
    ReactiveFormsModule     
  ]
})
export class ConfiguracionModule { }
