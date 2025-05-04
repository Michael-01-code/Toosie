import { PrescriptionHistoryComponent } from './prescription-history/prescription-history.component';
import { UploadPrescriptionComponent } from './upload-prescription/upload-prescription.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'upload-prescription',
    component: UploadPrescriptionComponent
  },
  {
    path: 'prescription-history',
    component: PrescriptionHistoryComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrescriptionRoutingModule { }
