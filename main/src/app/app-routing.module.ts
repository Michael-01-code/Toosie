import { PrescriptionComponent } from './prescription/prescription.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShopComponent } from './shop/shop.component';
import { PagesComponent } from './pages/pages.component';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role-guard.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home/main',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'dashboard',
    redirectTo: 'dashboard/main/sales/orders', // Redirect dashboard to sales orders by default
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./admin-dashboard/admin-dashboard.module').then(m => m.AdminDashboardModule),
    canActivate: [RoleGuard]
  },
  {
    path: 'shop',
    component: ShopComponent,
    loadChildren: () => import('./shop/shop.module').then(m => m.ShopModule)
  },
  { 
    path: 'pages',
    component: PagesComponent,
    loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule) 
  },
  { 
    path: 'prescription',
    component: PrescriptionComponent,
    loadChildren: () => import('./prescription/prescription.module').then(m => m.PrescriptionModule) 
  },
  {
    path: '**', // Navigate to Home Page if not found any page
    redirectTo: 'home/main',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabled',
    useHash: false,
    anchorScrolling: 'enabled',
    scrollPositionRestoration: 'enabled',
    relativeLinkResolution: 'legacy'
})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
