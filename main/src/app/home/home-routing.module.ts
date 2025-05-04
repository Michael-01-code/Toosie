import { BlogDetailsComponent } from './../pages/blog/blog-details/blog-details.component';
import { BlogNoSidebarComponent } from './../pages/blog/blog-no-sidebar/blog-no-sidebar.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { VegetableComponent } from './vegetable/vegetable.component';


const routes: Routes = [
  {
    path: 'main',
    component: VegetableComponent
  },
  {
    path: 'blog',
    component: BlogNoSidebarComponent
  },
  {
    path: 'blog/details/:id',
    component: BlogDetailsComponent
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
