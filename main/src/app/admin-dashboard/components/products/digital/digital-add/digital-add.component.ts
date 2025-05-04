import { ActivatedRoute, Router } from "@angular/router";
import { CommonModule } from '@angular/common';
import { miscEndpoint } from "./../../../../../core/config/endpoints";
import { Component, OnInit, NgModule  } from "@angular/core";
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms";
import { DropzoneConfigInterface } from "ngx-dropzone-wrapper";
import { InventoryService } from "src/app/core/service/inventory/inventory.service";
import * as Dropzone from "dropzone";
import { ToastrService } from "ngx-toastr";
import * as XLSX from 'xlsx'; // Import the XLSX library for handling Excel files

@Component({
  selector: "app-digital-add",
  templateUrl: "./digital-add.component.html",
  styleUrls: ["./digital-add.component.scss"],
})
export class DigitalAddComponent implements OnInit {
  public digital_list = [];
  public categories = [];
  public products = [];
  initialValue = {
    category: "",
    title: "",
    description: "",
    ingredients: "",
    warning: "",
    enabled: false,
    isSpecial: false,
    isTrending: false,
    stock: 0,
    actualPrice: 0,
    discountPercent: 0,
    tags: "",
    brand: "",
  };
  min: any = 0;
  max: any = 0;
  productPage = true;
  productForm: FormGroup;
  editProduct: any = {};
  isEdit = false;
  hide = true;
  loading = false;
  files: File[] = [];
  savedImages = [];
  public config1: DropzoneConfigInterface = {
    clickable: true,
    url: "https://github.com/dropzone/dropzone/issues/862",
    maxFiles: 1,
    autoReset: null,
    errorReset: null,
    cancelReset: null,
  };
  productId: any;
  constructor(
    private invS: InventoryService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private toastrService: ToastrService
  ) {
    // Dropzone.autoDiscover = false;
    this.productForm = this.fb.group({
      category: ["", [Validators.required]],
      title: ["", [Validators.required]],
      description: ["", [Validators.required]],
      ingredients: ["", [Validators.required]],
      warning: ["", [Validators.required]],
      // shortSummary: ['', [Validators.required ]],
      enabled: [false, [Validators.required]],
      isSpecial: [false, [Validators.required]],
      isTrending: [false, [Validators.required]],
      stock: [0, [Validators.required]],
      actualPrice: [0, [Validators.required]],
      discountPercent: [0, [Validators.required]],
      tags: ["", [Validators.required]],
      brand: ["", [Validators.required]],
    });
  }

  onSelect(event) {
    console.log(event);
    this.files.push(...event.addedFiles);
  }

  onRemove(event) {
    console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }
  ngOnInit() {
    this.productId = this.route.snapshot.params.id;
    console.log(this.route.snapshot.params.id);
    if (this.productId) {
      this.invS.singleInventory(this.productId).subscribe((e: any) => {
        console.log(e.data);
        const product = e.data;
        this.editProduct = e.data;
        this.savedImages = e.data.resourceImages;
        this.productForm.patchValue({
          ...product,
          tags: product.tags.join(","),
        });
        this.isEdit = true;
      });
    }
    this.invS.allCategories().subscribe((e: any) => {
      this.categories = e.data;
      const baby = this.categories[0];
    });
  }
  saveProduct() {
    this.loading = true;
    if (this.isEdit) {
      this.saveEditedProduct();
    } else {
      this.saveNewProduct();
    }
  }
  saveNewProduct() {
    const data = new FormData();
    const obj = this.submitObj();
    for (let i = 0; i < this.files.length; i++) {
      data.append("upload", this.files[i], this.files[i].name);
    }
    this.invS.uploadMedia(data).subscribe((inv) => {
      (obj.resourceImages = inv.images), console.log(obj);
      this.invS.createInventory(obj).subscribe((res) => {
        console.log(res);
        this.afterSbumit();
      });
    });
  }
  saveEditedProduct() {
    const obj = this.submitObj();
    if (this.files.length > 0) {
      const data = new FormData();
      for (let i = 0; i < this.files.length; i++) {
        data.append("upload", this.files[i], this.files[i].name);
      }
      this.invS.uploadMedia(data).subscribe((inv) => {
        obj.resourceImages = [...this.savedImages, ...inv.images] ;
        this.invS.updateInventory(this.productId, obj).subscribe((res) => {
          console.log(res);
          this.afterSbumit()
        });
      });
    } else {
      this.invS.updateInventory(this.productId, obj).subscribe((res) => {
        console.log(res);
        this.afterSbumit();
      });
    }
  }

  submitObj() {
    return {
      ...this.productForm.value,
      tags: this.tags?.value?.split(","),
      discountPercent: parseInt(this.discountPercent.value, 10),
      actualPrice: parseInt(this.actualPrice.value, 10),
      stock: parseInt(this.stock.value, 10),
    };
  }

  afterSbumit() {
    this.loading = false;
    this.files = [];
    this.productForm.reset(this.initialValue);
    this.toastrService.success("Product Created Successfully");
    this.router.navigateByUrl("dashboard/main/products/product-list");
    console.log(this.productForm.value);
  }
  removeItem(v) {
    this.savedImages = this.savedImages.filter((i) => i !== v);
  }

  get title() {
    return this.productForm.get("title");
  }
  get category() {
    return this.productForm.get("category");
  }
  get description() {
    return this.productForm.get("description");
  }
  get actualPrice() {
    return this.productForm.get("actualPrice");
  }
  get discountPercent() {
    return this.productForm.get("discountPercent");
  }
  get images() {
    return this.productForm.get("images");
  }
  get tags() {
    return this.productForm.get("tags");
  }
  get brand() {
    return this.productForm.get("brand");
  }
  get stock() {
    return this.productForm.get("stock");
  }
}