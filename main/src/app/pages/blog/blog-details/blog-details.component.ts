import { BlogService } from 'src/app/core/service/blog/blog.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser'
@Component({
  selector: 'app-blog-details',
  templateUrl: './blog-details.component.html',
  styleUrls: ['./blog-details.component.scss']
})
export class BlogDetailsComponent implements OnInit {
  blog: any = {}
  relatedBlogs = []
  content: any = ''
  constructor(private route: ActivatedRoute, private blogS: BlogService, private sanitized: DomSanitizer) { }

  ngOnInit(): void {
    this.route.params.subscribe(p =>{
      this.blogS.blogStore.subscribe((bl: any) =>{
        this.blog = bl.filter(b => b._id === p.id)[0]
        this.content = this.sanitized.bypassSecurityTrustHtml(bl.blogContent)
        this.relatedBlogs = bl.filter(b => b._id !== p.id)
        console.log(this.blog)
      })
    })
  }

}
