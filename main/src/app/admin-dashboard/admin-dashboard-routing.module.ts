import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard.component';
import { ContentLayoutComponent } from './shared/layout/content-layout/content-layout.component';
import { content } from './shared/routes/content-routes';
import { RoleGuard } from 'src/app/core/guards/role-guard.guard';  // Import RoleGuard

const routes: Routes = [
  {
    path: 'main',
    component: ContentLayoutComponent,
    children: content,  // These child routes will be protected by RoleGuard
    canActivate: [RoleGuard],  // Apply the guard to protect all routes inside 'main'
  },
  {
    path: 'main/sales/orders',  // Seller should have access only to 'orders'
    component: AdminDashboardComponent,  // Assuming you have a component for 'orders'
    canActivate: [RoleGuard],  // Protect the 'orders' route as well
  },
  // Other potential routes can be added here if needed
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminDashboardRoutingModule { }
