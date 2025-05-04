import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MediaRoutingModule } from './media-routing.module';
import { MediaComponent } from './media/media.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { Ng2SmartTableModule } from 'ng2-smart-table';



@NgModule({
  declarations: [MediaComponent],
  imports: [
    CommonModule,
    MediaRoutingModule,
    ReactiveFormsModule,
    NgxDropzoneModule,
    Ng2SmartTableModule
  ],
  providers: []
})
export class MediaModule { }
