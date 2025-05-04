import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductService } from "../../shared/services/product.service";
import { Product } from "../../shared/classes/product";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  public products = [];

  constructor(public productService: ProductService) {
    this.productService.cartItems.subscribe(response => this.products = response);
  }

  ngOnInit(): void {
  }

  public get getTotal(): Observable<number> {
    return this.productService.cartTotalAmount();
  }

  // Increment quantity
  increment(product: Product, qty: number = 1) {
    this.productService.updateCartQuantity(product, qty);
  }

  // Decrement quantity
  decrement(product: Product, qty: number = -1) {
    if (product.quantity > 1) {
      this.productService.updateCartQuantity(product, qty);
    }
  }

  // Remove item from cart
  public removeItem(product: Product) {
    this.productService.removeCartItem(product);
  }
}
