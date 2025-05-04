import { PrescriptionService } from './../../core/service/prescription/prescription.service';
import { AuthService } from './../../core/service/auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { InventoryService } from 'src/app/core/service/inventory/inventory.service';

@Component({
  selector: 'app-upload-prescription',
  templateUrl: './upload-prescription.component.html',
  styleUrls: ['./upload-prescription.component.scss']
})
export class UploadPrescriptionComponent implements OnInit {

  public digital_list = []
  public categories = []
  public products = []
  min: any = 0;
  max: any = 0; 
  productPage = true
  prescriptionForm: FormGroup;
  hide = true;
  loading = false;
  files: File[] = [];
  user: any
  constructor(private prescS: PrescriptionService, private fb: FormBuilder, private authS: AuthService) {
    // Dropzone.autoDiscover = false;
    this.prescriptionForm = this.fb.group({
      description: ['', [Validators.required ]],
    });
    this.user = this.authS.currentUser()
  }

  

  public onUploadInit(args: any): void { }

  public onUploadError(args: any): void { }

  public onUploadSuccess(args: any): void {
    console.log(args)
   }

  ngOnInit() {
    
  }
  onSelect(event) {
    console.log(event);
    this.files.push(...event.addedFiles);
  }
  
  onRemove(event) {
    console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }
  savePrescription(){
    this.loading = true
    var data = new FormData();
    data.append('upload', this.files[0]);
    if(this.files.length > 0){
      this.prescS.uploadMedia(data).subscribe(e =>{
        const object = {
          description: this.description?.value,
          prescriptionImage: e.images[0],
          customerId: this.user._id
        }
        this.prescS.creatPrescription(object).subscribe(inv =>{
          console.log(inv)
          this.loading = false;
          this.files = []
          this.prescriptionForm.reset()
        })
  
      })

    }
  }
  
  get description() {
    return this.prescriptionForm.get('description');
  }
}
