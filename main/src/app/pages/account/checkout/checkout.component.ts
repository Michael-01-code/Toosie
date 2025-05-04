import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InventoryService } from 'src/app/core/service/inventory/inventory.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  public orderForm: FormGroup
  constructor(private invS: InventoryService, private fb: FormBuilder) {
    // Dropzone.autoDiscover = false;
    this.orderForm = this.fb.group({
      address: ['', [Validators.required, ]],
      state: ['', [Validators.required, ]],
      postalCode: ['', [Validators.required, ]],
    });
  }

  ngOnInit(): void {

  }

}
