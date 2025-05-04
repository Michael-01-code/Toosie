import { BlogService } from 'src/app/core/service/blog/blog.service';
import { Component, OnInit } from '@angular/core';
import { translationsDB } from '../../../shared/tables/translations';

@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.scss']
})
export class AdminBlogList implements OnInit {

  public translations = []
  blogs = []
  constructor(private service: BlogService) {
    this.translations = translationsDB.data;
  }

  public settings = {
    actions: {
      edit: false,
      add: false,
      position: 'right'
  },
    delete: {
      confirmDelete: true,

      deleteButtonContent: 'Delete data',
      saveButtonContent: 'save',
      cancelButtonContent: 'cancel'
    },
    columns: {
      blogTitle: {
        title: 'Title'
      },
      blogContent: {
        title: 'Content',
        type: 'html'
      },
      blogImage: {
        title: 'Image',
        type: 'html'
      },
      blogAuthor: {
        title: 'Author'
      },
      edit: {
        title: 'Edit',
        filter: false,
        type: 'html'
      }
    },
  };


  ngOnInit() {
    this.service.blogStore.subscribe(e =>{
      this.blogs = e.map(blog =>{
        return {
          ...blog,
          blogAuthor: blog?.blogAuthor?.fullName,
          blogContent: blog.blogContent.slice(0,50) + '...',
          blogImage: `<img src=${blog?.blogImage} class='imgTable'>`,
            edit: `
           <a href=dashboard/main/blog/edit-blog/${blog._id} class="ng2-smart-action ng2-smart-action-edit-edit ng-star-inserted"><a/>`
        }
      })
    })
  }
  onDeleteConfirm(event) {
    console.log("Delete Event In Console")
    console.log(event);
    if (window.confirm('Are you sure you want to delete?')) {
      this.service.deleteBlog(event.data._id)
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }
}
