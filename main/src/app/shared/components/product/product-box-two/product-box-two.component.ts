import { Router } from "@angular/router";
import { Component, OnInit, Input, ViewChild } from "@angular/core";
import { QuickViewComponent } from "../../modal/quick-view/quick-view.component";
import { CartModalComponent } from "../../modal/cart-modal/cart-modal.component";
import { Product } from "../../../classes/product";
import { ProductService } from "../../../services/product.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-product-box-two",
  templateUrl: "./product-box-two.component.html",
  styleUrls: ["./product-box-two.component.scss"],
})
export class ProductBoxTwoComponent implements OnInit {
  @Input() product;
  @Input() currency: any = this.productService.Currency; // Default Currency
  @Input() cartModal: boolean = false; // Default False

  @ViewChild("quickView") QuickView: QuickViewComponent;
  @ViewChild("cartModal") CartModal: CartModalComponent;

  public ImageSrc: string;

  constructor(
    private productService: ProductService,
    private toast: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  navigate(id) {
    this.router.navigateByUrl("/shop/category/single/" + id);
  }

  // Get Product Color
  Color(variants) {
    const uniqColor = [];
    for (let i = 0; i < Object.keys(variants).length; i++) {
      if (uniqColor.indexOf(variants[i].color) === -1 && variants[i].color) {
        uniqColor.push(variants[i].color);
      }
    }
    return uniqColor;
  }

  // Change Variants
  ChangeVariants(color, product) {
    product.variants.map((item) => {
      if (item.color === color) {
        product.images.map((img) => {
          if (img.image_id === item.image_id) {
            this.ImageSrc = img.src;
          }
        });
      }
    });
  }

  ChangeVariantsImage(src) {
    this.ImageSrc = src;
  }

  addToCart(product: any) {
    console.log(product);
    if (product.stock === 0) {
      this.toast.error("This product is out of stock")
    }else{

      this.productService.addToCart(product);
    }
  }

  addToWishlist(product: any) {
    this.productService.addToWishlist(product);
  }

  addToCompare(product: any) {
    this.productService.addToCompare(product);
  }
}
