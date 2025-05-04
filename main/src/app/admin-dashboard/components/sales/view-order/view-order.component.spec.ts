import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-order',
  templateUrl: './view-order.component.html',
  styleUrls: ['./view-order.component.scss']
})
export class ViewOrderComponent implements OnInit {
  order: any = {}; // Example order data, replace with actual data
  isModalOpen: boolean = false;

  constructor() {}

  ngOnInit(): void {}

  // Toggle function to open/close the modal
  openModal(): void {
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }
}
