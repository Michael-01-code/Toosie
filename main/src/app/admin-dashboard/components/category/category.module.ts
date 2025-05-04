import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Ng2SmartTableModule } from 'ng2-smart-table';
import { CKEditorModule } from 'ngx-ckeditor';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';


import { GalleryModule } from '@ks89/angular-modal-gallery';
import 'hammerjs';
import 'mousetrap';


import { CategoryRoutingModule } from './category-routing.module';
import { DigitalCategoryComponent } from './digital-category/digital-category.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { EditCategoryComponent } from './edit-category/edit-category.component';





@NgModule({
  declarations: [DigitalCategoryComponent, EditCategoryComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CKEditorModule,
    CategoryRoutingModule,
    Ng2SmartTableModule,
    NgbModule,
    NgxDropzoneModule,
    GalleryModule.forRoot()
  ],
  providers: [
    NgbActiveModal
  ]
})
export class CategoryModule { }
