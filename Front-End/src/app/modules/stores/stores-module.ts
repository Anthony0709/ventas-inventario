import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoresRoutingModule } from './stores-routing-module';
import { StoreList } from './store-list/store-list';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    StoreList
  ],
  imports: [
    CommonModule,  
    StoresRoutingModule,
    ReactiveFormsModule,
    FormsModule,
  ]
})
export class StoresModule { }
