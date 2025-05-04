import { locationList } from './../../shop/checkout/locations';
import { baseEndpoints } from './../../core/config/endpoints';
import { RequestService } from './../../core/request/request.service';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

const state = {
  checkoutItems: JSON.parse(localStorage['checkoutItems'] || '[]')
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  allOrder: BehaviorSubject<any> = new BehaviorSubject([]);

  constructor(private router: Router, private reqS: RequestService) { }

  // Get Checkout Items
  public get checkoutItems(): Observable<any> {
    const itemsStream = new Observable(observer => {
      observer.next(state.checkoutItems);
      observer.complete();
    });
    return <Observable<any>>itemsStream;
  }

  // Create order
  public createOrder(product: any, details: any, customerID, amount: any) {
    const orderDetails = product.map(e => { return { product: e._id, quantity: e.quantity}})
    const deliveryCost = locationList.filter(e => e.label === details.city )[0].value
    var item = {
        customerId: customerID,
        priorityDelivery: details.priorityDelivery,
        deliveryType: details.deliveryType,
        shipping: {
          city: details.city,
          state: details.state,
          address: details.address,
          addressDeliveryCost: deliveryCost,
          postalCode: details.postalcode
        },
        products: product,
        orderDetails: orderDetails,
        totalCost: amount,
        paymentMethod: details.paymentMethod,
        paymentId: details.paymentId,
    };
    // state.checkoutItems = item;
    // localStorage.setItem("checkoutItems", JSON.stringify(item)); 
    this.reqS.post(baseEndpoints.order, item).subscribe((e: any )=> {
      const paymentId = e.data.paymentId
      this.router.navigate(['/shop/checkout/success', paymentId]);

    })
    localStorage.removeItem("cartItems");
  }

  getAllOrders(){
    return this.reqS.get(baseEndpoints.order)
  }
  updateOrder(id, data){
    return this.reqS.put(baseEndpoints.order + '/' + id, data)
  }
  deleteOrder(id, ){
    return this.reqS.delete(baseEndpoints.order + '/' + id)
  }
  getTransaction(id){
    return this.reqS.get(baseEndpoints.order + "?paymentId=" + id)
  }
}
