import { ProductLayoutComponent } from './product-layout.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DigitalListComponent } from './digital/digital-list/digital-list.component';
import { DigitalAddComponent } from './digital/digital-add/digital-add.component';
// import { ProductDetailComponent } from './physical/product-detail/product-detail.component';

const routes: Routes = [
  {
    path: '',
    // component: ProductLayoutComponent,
    children: [
      {
        path: 'product-list',
        component: DigitalListComponent,
        data: {
          title: "Product List",
          breadcrumb: "Product List"
        }
      },
      {
        path: 'product-details',
        component: DigitalAddComponent,
        data: {
          title: "Product List",
          breadcrumb: "Product List"
        }
      },
      {
        path: 'add-product',
        component: DigitalAddComponent,
        data: {
          title: "Add Products",
          breadcrumb: "Add Product"
        }
      },
      {
        path: 'edit-product/:id',
        component: DigitalAddComponent,
        data: {
          title: "Edit Products",
          breadcrumb: "Edit Product"
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
