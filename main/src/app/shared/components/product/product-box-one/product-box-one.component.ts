import { ToastrService } from "ngx-toastr";
import { Component, OnInit, Input, ViewChild } from "@angular/core";
import { QuickViewComponent } from "../../modal/quick-view/quick-view.component";
import { CartModalComponent } from "../../modal/cart-modal/cart-modal.component";
import { Product } from "../../../classes/product";
import { ProductService } from "../../../services/product.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-product-box-one",
  templateUrl: "./product-box-one.component.html",
  styleUrls: ["./product-box-one.component.scss"],
})
export class ProductBoxOneComponent implements OnInit {
  @Input() product;
  @Input() currency: any = this.productService.Currency; // Default Currency
  @Input() thumbnail: boolean = false; // Default False
  @Input() onHowerChangeImage: boolean = false; // Default False
  @Input() cartModal: boolean = false; // Default False
  @Input() loader: boolean = false;
  outOfStockMessage = "This product is out of stock";
  @ViewChild("quickView") QuickView: QuickViewComponent;
  @ViewChild("cartModal") CartModal: CartModalComponent;

  public ImageSrc: string;

  constructor(
    private productService: ProductService,
    private router: Router,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {
    // console.log(this.product);
    if (this.loader) {
      setTimeout(() => {
        this.loader = false;
      }, 2000); // Skeleton Loader
    }
  }
  navigate(id) {
    // alert('dd')
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

  // Change Variants Image
  ChangeVariantsImage(src) {
    this.ImageSrc = src;
  }
  outOfStock() {
    this.toast.warning(this.outOfStockMessage);
  }

  addToCart(product: any) {
    console.log(product);
    if (product.stock === 0) {
      this.outOfStock();
    } else {
      // this.productService.addToCart(product);
    }
  }

  addToWishlist(product: any) {
    if (product.stock === 0) {
      this.outOfStock();
    } else {
      this.productService.addToWishlist(product);
    }
  }

  addToCompare(product: any) {
    if (product.stock === 0) {
      this.outOfStock();
    } else {
      this.productService.addToCompare(product);
    }
  }

  parseStr(str) {
    return parseInt(str);
  }
}
