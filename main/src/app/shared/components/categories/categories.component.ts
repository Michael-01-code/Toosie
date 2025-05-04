import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InventoryService } from 'src/app/core/service/inventory/inventory.service';
import { Product } from '../../classes/product';
import { CategorySlider } from '../../data/slider';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {

  public products: Product[] = [];
  public collapse: boolean = true;
  categories :any[]=  [];
  fakeproducts :any[]=  [1,2,3,4,5,6];
  loading = false;
  constructor(private inventoryS: InventoryService, private route: ActivatedRoute) { }

  public CategorySliderConfig: any = CategorySlider;

  ngOnInit() {
    this.loadCategory();
  }
  loadCategory(){
    const catId = this.route.snapshot.params.slug
    this.inventoryS.allCategories().subscribe((e: any) =>{
      this.categories = e.data;
      this.loadInventory(catId);
    });
  }
  loadInventory(id: any){
    this.loading = true;
    
    this.inventoryS.inventoryByCategory(id).subscribe((e: any) =>{
      this.loading = false;
      this.products = e.inventory;
    });
  }
  

 

  get filterbyCategory() {
    const category = [...new Set(this.products.map(product => product.type))]
    return category
  }
  slugify(str: string){
    
    return this.inventoryS.string_to_slug(str)
  }

}
