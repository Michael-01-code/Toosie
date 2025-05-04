import { Component, OnInit } from '@angular/core';
import { BlogService } from 'src/app/core/service/blog/blog.service';

@Component({
  selector: 'app-blog-no-sidebar',
  templateUrl: './blog-no-sidebar.component.html',
  styleUrls: ['./blog-no-sidebar.component.scss']
})
export class BlogNoSidebarComponent implements OnInit {
  blogs = []
  constructor(private blogS: BlogService) { }

  ngOnInit( ): void {
    this.blogS.blogStore.subscribe(bl =>{
      this.blogs = bl
    })
  }

}
