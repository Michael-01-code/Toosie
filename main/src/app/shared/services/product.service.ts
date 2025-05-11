import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Product } from '../classes/product';
import { BehaviorSubject } from 'rxjs';

const state = {
  products: JSON.parse(localStorage['products'] || '[]'),
  wishlist: JSON.parse(localStorage['wishlistItems'] || '[]'),
  compare: JSON.parse(localStorage['compareItems'] || '[]'),
  cart: JSON.parse(localStorage['cartItems'] || '[]')
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  public Currency = { name: 'Naira', currency: '₦', price: 1 }; // Default Currency
  public OpenCart: boolean = false;
  public Products;

  constructor(private http: HttpClient, private toastrService: ToastrService) { }

  /*
    ---------------------------------------------
    ---------------  Product  -------------------
    ---------------------------------------------
  */

  private get products(): Observable<Product[]> {
    this.Products = this.http.get<Product[]>('assets/data/products.json').pipe(map(data => data));
    this.Products.subscribe(next => { localStorage['products'] = JSON.stringify(next) });
    return this.Products = this.Products.pipe(startWith(JSON.parse(localStorage['products'] || '[]')));
  }

  public get getProducts(): Observable<Product[]> {
    return this.products;
  }

  public getProductBySlug(slug: string): Observable<Product> {
    return this.products.pipe(map(items => {
      return items.find((item: any) => {
        return item.title.replace(' ', '-') === slug;
      });
    }));
  }
  public getProductById(id: number): Observable<Product | undefined> {
    return this.products.pipe(
      map((items: Product[]) => items.find(product => product._id === id))
    );
  }

  /*
    ---------------------------------------------
    ---------------  Wish List  -----------------
    ---------------------------------------------
  */

  private wishlistSubject = new BehaviorSubject<Product[]>([]);
  public wishlistItems$ = this.wishlistSubject.asObservable(); // this is what components will subscribe to
    
  public get wishlistItems(): Observable<Product[]> {
    return new Observable(observer => {
      observer.next(state.wishlist);
      observer.complete();
    });
  }

  public addToWishlist(product: Product): boolean {
    const exists = state.wishlist.find(item => item._id === product._id);
    if (!exists) {
      state.wishlist.push({ ...product });
      localStorage.setItem("wishlistItems", JSON.stringify(state.wishlist));
  
      // 🔁 Notify all subscribers
      /* this.wishlistSubject.next(state.wishlist); */
  
      this.toastrService.success('Product has been added to wishlist.');
    } 
    else {
      this.toastrService.info('Product already in wishlist.');
    }
  
    return true;
  }

  /* public addToWishlist(product): any {
    const wishlistItem = state.wishlist.find(item => item.id === product.id);
    if (!wishlistItem) {
      state.wishlist.push({ ...product });
    }
    this.toastrService.success('Product has been added in wishlist.');
    localStorage.setItem("wishlistItems", JSON.stringify(state.wishlist));
    return true;
  } */


  public removeWishlistItem(product: Product): any {
    const index = state.wishlist.indexOf(product);
    state.wishlist.splice(index, 1);
    localStorage.setItem("wishlistItems", JSON.stringify(state.wishlist));
    return true;
  }

  /*
    ---------------------------------------------
    -------------  Compare Product  -------------
    ---------------------------------------------
  */

  public get compareItems(): Observable<Product[]> {
    return new Observable(observer => {
      observer.next(state.compare);
      observer.complete();
    });
  }

  public addToCompare(product): any {
    const compareItem = state.compare.find(item => item.id === product.id);
    if (!compareItem) {
      state.compare.push({ ...product });
    }
    this.toastrService.success('Product has been added in compare.');
    localStorage.setItem("compareItems", JSON.stringify(state.compare));
    return true;
  }

  public removeCompareItem(product: Product): any {
    const index = state.compare.indexOf(product);
    state.compare.splice(index, 1);
    localStorage.setItem("compareItems", JSON.stringify(state.compare));
    return true;
  }

  /*
    ---------------------------------------------
    -----------------  Cart  --------------------
    ---------------------------------------------
  */

  public get cartItems(): Observable<Product[]> {
    return new Observable(observer => {
      observer.next(state.cart);
      observer.complete();
    });
  }

  public addToCart(product): boolean {
  if (product.stock > 0) {
    const cartItem = state.cart.find(item => item._id === product._id);
    const qtyToAdd = product.quantity ?? 1;
    const currentQtyInCart = cartItem?.quantity ?? 0;

    const canAdd = this.calculateStockCounts(product, currentQtyInCart, qtyToAdd);
    if (!canAdd) return false;

    if (cartItem) {
      cartItem.quantity += qtyToAdd;
    } else {
      state.cart.push({
        ...product,
        quantity: qtyToAdd
      });
    }

    this.OpenCart = true;
    localStorage.setItem("cartItems", JSON.stringify(state.cart));
    return true;
  }

  this.toastrService.error('Product is out of stock!');
  return false;
}


  public updateCartQuantity(product, changeInQty: number): boolean {
  const index = state.cart.findIndex(item => item._id === product._id);

  if (index > -1) {
    const cartItem = state.cart[index];
    const newQty = cartItem.quantity + changeInQty;

    if (newQty <= 0) {
      this.removeCartItem(product);
      return true;
    }

    const canUpdate = this.calculateStockCounts(product, cartItem.quantity, changeInQty);
    if (!canUpdate) return false;

    cartItem.quantity = newQty;
    localStorage.setItem("cartItems", JSON.stringify(state.cart));
    return true;
  }

  return false;
}


  public calculateStockCounts(product, currentQty: number, addedQty: number): boolean {
  const totalQty = currentQty + addedQty;
  const stock = product.stock;

  if (stock < totalQty || stock === 0) {
    this.toastrService.error(`Currently low on stock. Only ${stock} item(s) in stock.`);
    return false;
  }
  return true;
}


  public removeCartItem(product: Product): any {
    const index = state.cart.findIndex(item => item._id === product._id);
    if (index > -1) {
      state.cart.splice(index, 1);
      localStorage.setItem("cartItems", JSON.stringify(state.cart));
    }
    return true;
  }

  // ✅ FIXED: Clear Cart
  public clearCart(): void {
    state.cart = [];
    localStorage.setItem("cartItems", JSON.stringify([]));
  }

  public cartTotalAmount(): Observable<number> {
    return this.cartItems.pipe(map((product) => {
      return product.reduce((prev, curr: any) => {
        let price = (curr.actualPrice) - (curr.actualPrice * (curr.discountPercent / 100));
        return (prev + price * curr.quantity);
      }, 0);
    }));
  }

  /*
    ---------------------------------------------
    ------------  Filter Product  ---------------
    ---------------------------------------------
  */

  // Get Product Filter
  public filterProducts(filter: any): Observable<Product[]> {
    return this.products.pipe(map(product => 
      product.filter((item: Product) => {
        if (!filter.length) return true;
        const Tags = filter.some((prev) => { // Match Tags
          if (item.tags) {
            if (item.tags.includes(prev)) {
              return prev;
            }
          }
        })
        return Tags;
      })
    ));
  }

  // Sorting Filter
  public sortProducts(products: Product[], payload: string): any {

    if(payload === 'ascending') {
      return products.sort((a, b) => {
        if (a._id < b._id) {
          return -1;
        } else if (a._id > b._id) {
          return 1;
        }
        return 0;
      })
    } else if (payload === 'a-z') {
      return products.sort((a, b) => {
        if (a.title < b.title) {
          return -1;
        } else if (a.title > b.title) {
          return 1;
        }
        return 0;
      })
    } else if (payload === 'z-a') {
      return products.sort((a, b) => {
        if (a.title > b.title) {
          return -1;
        } else if (a.title < b.title) {
          return 1;
        }
        return 0;
      })
    } else if (payload === 'low') {
      return products.sort((a, b) => {
        if (a.price < b.price) {
          return -1;
        } else if (a.price > b.price) {
          return 1;
        }
        return 0;
      })
    } else if (payload === 'high') {
      return products.sort((a, b) => {
        if (a.price > b.price) {
          return -1;
        } else if (a.price < b.price) {
          return 1;
        }
        return 0;
      })
    } 
  }

  /*
    ---------------------------------------------
    ------------- Product Pagination  -----------
    ---------------------------------------------
  */
  public getPager(totalItems: number, currentPage: number = 1, pageSize: number = 16) {
    // calculate total pages
    let totalPages = Math.ceil(totalItems / pageSize);

    // Paginate Range
    let paginateRange = 3;

    // ensure current page isn't out of range
    if (currentPage < 1) { 
      currentPage = 1; 
    } else if (currentPage > totalPages) { 
      currentPage = totalPages; 
    }
    
    let startPage: number, endPage: number;
    if (totalPages <= 5) {
      startPage = 1;
      endPage = totalPages;
    } else if(currentPage < paginateRange - 1){
      startPage = 1;
      endPage = startPage + paginateRange - 1;
    } else {
      startPage = currentPage - 1;
      endPage =  currentPage + 1;
    }

    // calculate start and end item indexes
    let startIndex = (currentPage - 1) * pageSize;
    let endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

    // create an array of pages to ng-repeat in the pager control
    let pages = Array.from(Array((endPage + 1) - startPage).keys()).map(i => startPage + i);

    // return object with all pager properties required by the view
    return {
      totalItems: totalItems,
      currentPage: currentPage,
      pageSize: pageSize,
      totalPages: totalPages,
      startPage: startPage,
      endPage: endPage,
      startIndex: startIndex,
      endIndex: endIndex,
      pages: pages
    };
  }

}
