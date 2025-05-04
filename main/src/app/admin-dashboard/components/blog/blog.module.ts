import { AddBlogComponent } from './add-blog/add-blog.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminBlogRoutingModule } from './blog-routing.module';
import { AdminBlogList } from './blog-list/blog-list.component';

import { Ng2SmartTableModule } from 'ng2-smart-table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { CKEditorModule } from 'ngx-ckeditor';


@NgModule({
  declarations: [AdminBlogList, AddBlogComponent],
  imports: [
    CommonModule,
    AdminBlogRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    Ng2SmartTableModule,
    NgxDropzoneModule,
    CKEditorModule
  ]
})
export class AdminBlogModule { }
