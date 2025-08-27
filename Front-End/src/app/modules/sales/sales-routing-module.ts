import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SaleList } from './sale-list/sale-list';

const routes: Routes = [
  { path: '', component: SaleList }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesRoutingModule { }
