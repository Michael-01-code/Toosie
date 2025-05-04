import { CategoryModule } from './../../components/category/category.module';
import { Routes } from '@angular/router';

export const content: Routes = [

  {
    path: 'banners',
    loadChildren: () => import('../../components/media/media.module').then(m => m.MediaModule),
  },
  {
    path: 'products',
    loadChildren: () => import('../../components/products/products.module').then(m => m.ProductsModule),
    data: {
      breadcrumb: "Products"
    }
  },
  {
    path: 'category',
    loadChildren: () => import('../../components/category/category.module').then(m => m.CategoryModule),
    data: {
      breadcrumb: "Category"
    }
  },
  {
    path: 'sales',
    loadChildren: () => import('../../components/sales/sales.module').then(m => m.SalesModule),
    data: {
      breadcrumb: "Category"
    }
  },
  {
    path: 'users',
    loadChildren: () => import('../../components/users/users.module').then(m => m.UsersModule),
    data: {
      breadcrumb: "Category"
    }
  },
  {
    path: 'blog',
    loadChildren: () => import('../../components/blog/blog.module').then(m => m.AdminBlogModule),
    data: {
      breadcrumb: "Category"
    }
  },
  {
    path: 'prescriptions',
    loadChildren: () => import('../../components/prescription/prescription.module').then(m => m.PrescriptionModule),
    data: {
      breadcrumb: "Category"
    }
  },
 
  
  
  ];
