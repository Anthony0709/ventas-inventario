import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SalesRoutingModule } from './sales-routing-module';
import { SaleList } from './sale-list/sale-list';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    SaleList
  ],
  imports: [
    CommonModule,
    FormsModule,
    SalesRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
  ]
})
export class SalesModule { }
