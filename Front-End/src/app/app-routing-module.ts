import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { GuestGuard } from './guards/guest.guards';
import { MainLayout } from './layouts/main-layout/main-layout';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  {
    path: 'login',
    loadChildren: () =>
      import('./modules/auth/auth-module').then(m => m.AuthModule),
    canActivate: [GuestGuard]
  },

  {
    path: '',
    component: MainLayout,
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', loadChildren: () => import('./modules/dashboard/dashboard-module').then(m => m.DashboardModule), data: { role: ['admin', 'seller'] } },
      { path: 'products', loadChildren: () => import('./modules/products/products-module').then(m => m.ProductsModule), data: { role: ['admin', 'seller'] } },
      { path: 'stores', loadChildren: () => import('./modules/stores/stores-module').then(m => m.StoresModule), data: { role: ['admin', 'seller'] } },
      { path: 'sales', loadChildren: () => import('./modules/sales/sales-module').then(m => m.SalesModule), data: { role: ['admin', 'seller'] } },
      { path: 'entradas', loadChildren: () => import('./modules/entradas/entradas-module').then(m => m.EntradasModule), data: { role: ['admin', 'seller'] } },
      { path: 'reportes', loadChildren: () => import('./modules/reportes/reportes-module').then(m => m.ReportesModule), data: { role: ['admin', 'seller'] } },
      { path: 'configuracion', loadChildren: () => import('./modules/configuracion/configuracion-module').then(m => m.ConfiguracionModule), data: { role: ['admin', 'seller'] } }
    ]
  },

  { path: '**', redirectTo: 'login' }
];


@NgModule({
 imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
