import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ViewportScroller } from "@angular/common";
import { ProductService } from "../../../shared/services/product.service";
import { Product } from "../../../shared/classes/product";
import { InventoryService } from "src/app/core/service/inventory/inventory.service";

@Component({
  selector: "app-collection-no-sidebar",
  templateUrl: "./collection-no-sidebar.component.html",
  styleUrls: ["./collection-no-sidebar.component.scss"],
})
export class CollectionNoSidebarComponent implements OnInit {
  public grid: string = "col-xl-3 col-md-6";
  public layoutView: string = "grid-view";
  public products: Product[] = [];
  public pageNo: number = 1;
  public paginate: any = {}; // Pagination use only
  public sortBy: string; // Sorting Order

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private invS: InventoryService,
    private viewScroller: ViewportScroller,
    public productService: ProductService
  ) {
    // Get Query params..
    this.route.queryParams.subscribe(params => {
      this.sortBy = params.sortBy ? params.sortBy : 'ascending';
      this.pageNo = params.page ? params.page : this.pageNo;
      // Get Filtered Products..
      this.invS.searchStore.subscribe(response => {
        // Sorting Filter
        this.products = this.productService.sortProducts(response, this.sortBy);
        // Paginate Products
        this.paginate = this.productService.getPager(this.products.length, +this.pageNo);     // get paginate object from service
        this.products = this.products.slice(this.paginate.startIndex, this.paginate.endIndex + 1); // get current page of items
      })
    })
  }

  ngOnInit(): void {
    this.invS.searchStore.subscribe((e) => {
      if (e.length === 0) {
        // When product is empty redirect 404
        this.router.navigateByUrl("/pages/404", { skipLocationChange: true });
      } else {
        this.sortBy = "ascending";
        this.pageNo = this.pageNo;
        this.products = this.productService.sortProducts(e, this.sortBy);
        this.paginate = this.productService.getPager(
          this.products.length,
          +this.pageNo
        );
        this.products = this.products.slice(
          this.paginate.startIndex,
          this.paginate.endIndex + 1
        );
        console.log(this.products);
      }
    });
  }

  // SortBy Filter
  sortByFilter(value) {
    this.router
      .navigate([], {
        relativeTo: this.route,
        queryParams: { sortBy: value ? value : null },
        queryParamsHandling: "merge", // preserve the existing query params in the route
        skipLocationChange: false, // do trigger navigation
      })
      .finally(() => {
        this.viewScroller.scrollToAnchor("products"); // Anchore Link
      });
  }

  // product Pagination
  setPage(page: number) {
    this.router
      .navigate([], {
        relativeTo: this.route,
        queryParams: { page: page },
        queryParamsHandling: "merge", // preserve the existing query params in the route
        skipLocationChange: false, // do trigger navigation
      })
      .finally(() => {
        this.viewScroller.scrollToAnchor("products"); // Anchore Link
      });
  }

  // Change Grid Layout
  updateGridLayout(value: string) {
    this.grid = value;
  }

  // Change Layout View
  updateLayoutView(value: string) {
    this.layoutView = value;
    if (value == "list-view") this.grid = "col-lg-12";
    else this.grid = "col-xl-3 col-md-6";
  }
}
