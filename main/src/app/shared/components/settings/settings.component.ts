import { Component, OnInit, Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ProductService } from "../../services/product.service";
import { Product } from "../../classes/product";
import { Router } from '@angular/router';
import { InventoryService } from 'src/app/core/service/inventory/inventory.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  public products: Product[] = [];
  public search: boolean = false;
  searchTerm ='';
  searchTerm$ = new Subject<string>();
  public languages = [{ 
    name: 'English',
    code: 'en'
  }, {
    name: 'French',
    code: 'fr'
  }];

  public currencies = [{
    name: 'Euro',
    currency: 'EUR',
    price: 0.90 // price of euro
  }, {
    name: 'Naira',
    currency: '₦',
    price: 1 // price of naira
  }, {
    name: 'Pound',
    currency: 'GBP',
    price: 0.78 // price of euro
  }, {
    name: 'Dollar',
    currency: 'USD',
    price: 1 // price of usd
  }]

  constructor(@Inject(PLATFORM_ID) private platformId: Object,
    private translate: TranslateService,
    private invS: InventoryService,
    private router: Router,
    public productService: ProductService) {
    this.productService.cartItems.subscribe(response => this.products = response);
  }

  ngOnInit(): void {
  }

  searchItem(){

    console.log(this.searchTerm);
    this.searchTerm$.next(this.searchTerm);
    this.invS.searchInventory(this.searchTerm).subscribe((e: any) => {
      console.log(e);
      this.invS.searchStore.next(e.data)
      const items = e.data;
      if (items.length > 0) {
        this.getSimilarItems(items[0].category);
      }
      this.invS.loading.next(false);

    });
  }
  getSimilarItems(id) {
    this.invS.inventoryByCategory(id).subscribe((e: any) => {
      console.log(e);
      this.invS.similarStore.next(e.data);
      console.log(e.data);
      this.searchToggle()
  
      this.router.navigate(['shop/product/search'])
    });

  }
  searchToggle(){
    this.search = !this.search;
  }

  changeLanguage(code){
    if (isPlatformBrowser(this.platformId)) {
      this.translate.use(code)
    }
  }

  get getTotal(): Observable<number> {
    return this.productService.cartTotalAmount();
  }

  removeItem(product: any) {
    this.productService.removeCartItem(product);
  }

  changeCurrency(currency: any) {
    this.productService.Currency = currency
  }

}
