import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminBlogList } from './blog-list/blog-list.component';
import { AddBlogComponent } from './add-blog/add-blog.component';


const routes: Routes = [
  {
    path: 'blog-list',
    component: AdminBlogList,
    data: {
      title: "Blog List",
      breadcrumb: "Blog List"
    }
  },
  {
    path: 'add-blog',
    component: AddBlogComponent,
    data: {
      title: "Create Blog",
      breadcrumb: "Create Blog"
    }
  },
  {
    path: 'edit-blog/:id',
    component: AddBlogComponent,
    data: {
      title: "Edit Blog",
      breadcrumb: "Edit Blog"
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminBlogRoutingModule { }
