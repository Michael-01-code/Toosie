import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrescriptionRoutingModule } from './prescription-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { UploadPrescriptionComponent } from './upload-prescription/upload-prescription.component';
import { PrescriptionHistoryComponent } from './prescription-history/prescription-history.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    
    UploadPrescriptionComponent,
    PrescriptionHistoryComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    PrescriptionRoutingModule,
    Ng2SmartTableModule,
    NgxDropzoneModule,
    RouterModule
  ]
})
export class PrescriptionModule { }
