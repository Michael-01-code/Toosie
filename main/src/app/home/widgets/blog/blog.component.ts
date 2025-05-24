import { Component, OnInit, Input } from '@angular/core';
import { BlogSlider } from '../../../shared/data/slider';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {
  
  @Input() blogs: any[] = [];

  constructor() { }

  ngOnInit(): void {
  // Sort blogs by createdAt date in descending order (newest first)
  this.blogs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  console.log(this.blogs);
}

  public BlogSliderConfig: any = BlogSlider;

}
