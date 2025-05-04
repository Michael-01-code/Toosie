import { Component, OnInit } from '@angular/core';
import { ProductSlider } from '../../shared/data/slider';
import { Product } from '../../shared/classes/product';
import { ProductService } from '../../shared/services/product.service';
import { Observable } from 'rxjs';
import { BlogService } from 'src/app/core/service/blog/blog.service';
import { InventoryService } from 'src/app/core/service/inventory/inventory.service';

@Component({
  selector: 'app-vegetable',
  templateUrl: './vegetable.component.html',
  styleUrls: ['./vegetable.component.scss']
})
export class VegetableComponent implements OnInit {

  public products: Product[] = [];
  public ProductSliderConfig: any = ProductSlider;
  latestStore = [];
  featuredStore = []
  blogStore = [];
  year = new Date().getFullYear()
  constructor(public productService: ProductService, private invS: InventoryService, private blogS: BlogService) {
    this.productService.getProducts.subscribe(response => 
      this.products = response.filter(item => item.type == 'vegetables')
    );
  }

  // Sliders
  public sliders = [{
    title: 'save 10%',
    subTitle: 'Cosmetic and healthcare products',
    image: 'https://thumbs.dreamstime.com/z/contents-wonam-s-beauty-bag-cosmetics-contraceptives-pills-white-background-top-view-copyspace-96763091.jpg'
  }, {
    title: 'save 10%',
    subTitle: 'Beauty products',
    image: 'https://thumbs.dreamstime.com/z/face-care-cosmetics-jars-cream-face-serum-pink-background-beauty-salon-concept-face-care-cosmetics-jars-cream-175257022.jpg'
  }];

  // Blogs
  public blogs = [{
    image: 'assets/images/blog/6.jpg',
    date: '25 January 2018',
    title: 'Lorem ipsum dolor sit consectetur adipiscing elit,',
    by: 'John Dio'
  }, {
    image: 'assets/images/blog/7.jpg',
    date: '26 January 2018',
    title: 'Lorem ipsum dolor sit consectetur adipiscing elit,',
    by: 'John Dio'
  }, {
    image: 'assets/images/blog/8.jpg',
    date: '27 January 2018',
    title: 'Lorem ipsum dolor sit consectetur adipiscing elit,',
    by: 'John Dio'
  }, {
    image: 'assets/images/blog/9.jpg',
    date: '28 January 2018',
    title: 'Lorem ipsum dolor sit consectetur adipiscing elit,',
    by: 'John Dio'
  }]

  ngOnInit(): void {
   this.invS.latestStore.subscribe(inv =>this.latestStore = inv)
   this.invS.popularStore.subscribe(inv => this.featuredStore = inv)
   this.blogS.blogStore.subscribe(inv => this.blogStore = inv)
  }

}
