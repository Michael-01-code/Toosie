import { locationList } from './../locations';
import { ActivatedRoute } from '@angular/router';
import { OrdersService } from './../../../core/service/orders/orders.service';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Order } from '../../../shared/classes/order';
import { OrderService } from '../../../shared/services/order.service';
import { ProductService } from '../../../shared/services/product.service';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.scss']
})
export class SuccessComponent implements OnInit, AfterViewInit{

  public orderDetails : any = {};
  location
  deliveryDate: Date;

  constructor(public productService: ProductService,
    private orderService: OrderService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.deliveryDate = new Date();
    this.deliveryDate.setDate( this.deliveryDate.getDate() + 2 );
    const id = this.route.snapshot.params.id
    this.location = locationList
    this.orderService.getTransaction(id).subscribe((res: any) => {
      console.log(res.data)
      this.orderDetails = res.data[0]
    })
  }

  ngAfterViewInit() {
    
  }

}
