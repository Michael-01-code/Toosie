import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { InventoryService } from 'src/app/core/service/inventory/inventory.service';
import { Product } from '../classes/product';
import { ProductService } from './product.service';

@Injectable({
	providedIn: 'root'
})
export class SingleProductResolver implements Resolve<any> {
  
  public product = {};

  constructor(
    private router: Router,
    public invS: InventoryService
  ) {}

  // Resolver
  async resolve(route: ActivatedRouteSnapshot): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    this.invS.singleInventory(route.params.id).subscribe((product: any) => {
      if(!product) { // When product is empty redirect 404
          this.router.navigateByUrl('/pages/404', {skipLocationChange: true});
      } else {
          this.product = product.inventory
      }
    })
    return this.product;
  }
}
