import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StoreList } from './store-list/store-list';

const routes: Routes = [
    { path: '', component: StoreList }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StoresRoutingModule { }
