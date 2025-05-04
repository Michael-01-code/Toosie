import { baseEndpoints } from './../../config/endpoints';
/* eslint-disable no-underscore-dangle */
import { BehaviorSubject, from, Observable } from 'rxjs';
import { wishListEndpoints } from './../../config/endpoints';
import { RequestService } from './../../request/request.service';
import { Injectable } from '@angular/core';


const MY_CART = 'my_cart';
@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  cartStore: BehaviorSubject<any> = new BehaviorSubject([]);
   constructor(private reqS: RequestService) {
    const cart = localStorage.getItem(MY_CART)
    this.cartStore.next(JSON.parse(cart));
   
  }

  allOrders(){
    return this.reqS.get(baseEndpoints.order)
  }
  async removeCart() {
    await localStorage.removeItem(MY_CART);
    this.cartStore.next([]);
  };
  async addItemToCart(item) {
    item.quantity = 1;
    const cart = localStorage.getItem( MY_CART);
    if (cart) {
      const parseCart = JSON.parse(cart);
      // eslint-disable-next-line no-underscore-dangle
      const idx = parseCart.findIndex(e => e._id === item._id);
      if(idx < 0){
        parseCart.push(item);
        this.cartStore.next(parseCart);
        localStorage.setItem( MY_CART, JSON.stringify(parseCart));
        return true;

      }else{
        return false;
      }
    } else {
      localStorage.setItem( MY_CART, JSON.stringify([item]));
      this.cartStore.next([item]);
      return true;
    }
  }
  async removeItemFromCart(item){
    const cart = localStorage.getItem( MY_CART);
    if (cart) {
      const parseCart = JSON.parse(cart);
      // eslint-disable-next-line no-underscore-dangle
      const filt = parseCart.filter(e => e._id !== item._id);
      this.cartStore.next(filt);
      localStorage.setItem( MY_CART, JSON.stringify(filt));
    }
  }
  async incrementDecrement(item, type){
    const cart = localStorage.getItem(MY_CART);
    if(cart){
      if(type === 'increment'){
        item.quantity = item.quantity + 1;
        const parseCart = JSON.parse(cart);
        const index = parseCart.findIndex((e) => e._id === item._id);
        parseCart[index] = item;
        this.cartStore.next(parseCart);
        localStorage.setItem( MY_CART, JSON.stringify([...parseCart]));
      }else{
        item.quantity = item.quantity - 1;
        if(item.quantity < 1){
          this.removeItemFromCart(item);
        }else{
          const parseCart = JSON.parse(cart);
          const index = parseCart.findIndex((e) => e._id === item._id);
          parseCart[index] = item;
          this.cartStore.next(parseCart);
          localStorage.setItem( MY_CART, JSON.stringify([...parseCart]));
        }
      }
    }
  }
}
