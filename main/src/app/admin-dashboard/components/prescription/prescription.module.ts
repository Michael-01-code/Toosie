import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrescriptionRoutingModule } from './prescription-routing.module';
import { PrescriptionComponent } from './prescription.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GalleryModule } from '@ks89/angular-modal-gallery';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { CKEditorModule } from 'ngx-ckeditor';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { ProductsRoutingModule } from '../products/products-routing.module';
import { EditPrescriptionComponent } from './edit-prescription/edit-prescription.component';


@NgModule({
  declarations: [PrescriptionComponent, EditPrescriptionComponent],
  imports: [
    CommonModule,
    PrescriptionRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CKEditorModule,
    ProductsRoutingModule,
    Ng2SmartTableModule,
    NgbModule,
    GalleryModule.forRoot(),
    NgxDropzoneModule
  ]
})
export class PrescriptionModule { }
