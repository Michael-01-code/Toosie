import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrescriptionComponent } from './prescription.component';

const routes: Routes = [
  {
    path: '',
    children: [

      {
        path: 'list',
        component: PrescriptionComponent,
        data: {
          title: "User Prescription",
          breadcrumb: "Category"
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrescriptionRoutingModule { }
