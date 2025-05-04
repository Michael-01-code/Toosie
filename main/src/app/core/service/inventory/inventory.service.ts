import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { roleEndpoints, inventoryEndpoints, miscEndpoint, baseEndpoints } from './../../config/endpoints';
import { RequestService } from './../../request/request.service';
import { Injectable } from '@angular/core';
import { debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  cartStore: BehaviorSubject<any> = new BehaviorSubject([]);
  searchStore: BehaviorSubject<any> = new BehaviorSubject([]);
  categoryStore: BehaviorSubject<any> = new BehaviorSubject([]);
  popularStore: BehaviorSubject<any> = new BehaviorSubject([]);
  latestStore: BehaviorSubject<any> = new BehaviorSubject([]);
  similarStore: BehaviorSubject<any> = new BehaviorSubject([]);
  loading: BehaviorSubject<any> = new BehaviorSubject(false);
  constructor(private reqS: RequestService) {
    this.multipleRequest();
   }

  allBrands(){
    return this.reqS.get(inventoryEndpoints.brands).pipe(map((data: any) => data.inventoryBrands));
  }
  multipleRequest(){
    const popular = this.reqS.get(baseEndpoints.inventory + "?isSpecial=" + true );
    const latest = this.reqS.get(baseEndpoints.inventory + "?isTrending=" + true);
    const categories = this.reqS.get(baseEndpoints.category);
    forkJoin([popular, latest, categories]).subscribe((results: any) =>{
      // console.log(results)
      this.popularStore.next(results[0].data);
      this.latestStore.next(results[1].data);
      this.categoryStore.next(results[2].data);
    });
  }
  allCategories(){
    return this.reqS.get(baseEndpoints.category);
  }
  inventoryByCategory(id){
    return this.reqS.get(baseEndpoints.inventory +'?category=' + id);
  }
  singleInventory(id){
    return this.reqS.get(baseEndpoints.inventory + '/' + id);
  }
  myOrders(){
    return this.reqS.get(inventoryEndpoints.myOrders + '1');
  }
  searchInventory(term){

    this.loading.next(true);
    return this.reqS.get(baseEndpoints.searchProduct+'?searchText=' + term );
  }
  search(terms: Observable<string>){
    console.log(terms);
    return terms.pipe(debounceTime(1000),distinctUntilChanged(),
    switchMap(term => this.searchInventory(term)));
  }
  savePODCashOrder(obj){
    return this.reqS.post(inventoryEndpoints.savePODOrder, obj);
  }
  saveCardOrder(obj){
    return this.reqS.post(inventoryEndpoints.saveCardOrder, obj);
  }
  uploadMedia(formData): Observable<any> {
    return this.reqS.post(miscEndpoint.mediaUpload,formData);
  }
  saveTokenOrder(obj){
    return this.reqS.post(inventoryEndpoints.saveTokenOrder, obj);
  }
  string_to_slug (str) {
    str = str.replace(/^\s+|\s+$/g, ''); // trim
    str = str.toLowerCase();
  
    // remove accents, swap ñ for n, etc
    var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
    var to   = "aaaaeeeeiiiioooouuuunc------";
    for (var i=0, l=from.length ; i<l ; i++) {
        str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }

    str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
        .replace(/\s+/g, '-') // collapse whitespace and replace by -
        .replace(/-+/g, '-'); // collapse dashes

    return str;
}
  createInventory(inv: any){
    return this.reqS.post(baseEndpoints.inventory, inv)
  }
  deleteInventory(id: any){
    return this.reqS.delete(baseEndpoints.inventory + '/' + id)
  }
  updateInventory(id: any, obj){
    return this.reqS.put(baseEndpoints.inventory + '/' + id, obj )
  }
  getInventory(){
    return this.reqS.get(baseEndpoints.inventory)
  }
  createCategory(cat: any){
    return this.reqS.post(baseEndpoints.category, cat)
  }
  deleteCategory(id: any){
    return this.reqS.delete(baseEndpoints.category + '/' + id)
  }
  updateCategory(id: any, obj){
    return this.reqS.put(baseEndpoints.category + '/' + id, obj )
  }

}
