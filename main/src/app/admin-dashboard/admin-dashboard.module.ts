import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminDashboardRoutingModule } from './admin-dashboard-routing.module';
import { AdminSharedModule } from './shared/shared.module';


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    AdminDashboardRoutingModule,
    AdminSharedModule
  ]
})
export class AdminDashboardModule { }
