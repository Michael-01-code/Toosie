import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OrderService } from 'src/app/shared/services/order.service';

@Component({
  selector: 'app-view-order',
  templateUrl: './view-order.component.html',
  styleUrls: ['./view-order.component.scss']
})
export class ViewOrderComponent implements OnInit {
  closeResult: string;
  @Input() rowData
  order = null

  constructor(private modalService: NgbModal, private orderS: OrderService) { }

  ngOnInit(): void {

  }

  open(content) {
    console.log(this.rowData);
    this.orderS.allOrder.subscribe(e => {
      console.log(e);
      this.order = e.filter(o => o._id === this.rowData.id)[0]
    })
    this.modalService
      .open(content, { ariaLabelledBy: "modal-basic-title", size: 'lg' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }
  getDismissReason(reason: any) {
    console.log(reason);
  }

}
