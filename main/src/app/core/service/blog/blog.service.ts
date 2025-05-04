import { BehaviorSubject, Observable } from 'rxjs';
import { blogEndpoints, baseEndpoints, miscEndpoint } from './../../config/endpoints';
import { Injectable } from '@angular/core';
import { RequestService } from '../../request/request.service';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  blogStore: BehaviorSubject<any> = new BehaviorSubject([]);
  singleBlog: BehaviorSubject<any> = new BehaviorSubject({});
  constructor(private reqS: RequestService) {
    this.blogListing();
  }

  blogListing(){
    this.reqS.get(baseEndpoints.blog).subscribe((e: any) =>{
      console.log(e);
      this.blogStore.next(e.data);
    });
  }
  createBlog(data){
    return this.reqS.post(baseEndpoints.blog, data)
  }
  updateBlog(data, id){
    return this.reqS.put(baseEndpoints.blog + '/' + id, data)
  }
  uploadMedia(formData): Observable<any> {
    return this.reqS.post(miscEndpoint.mediaUpload, formData);
  }
  deleteBlog(id){
    return this.reqS.delete(baseEndpoints.blog + '/' + id).subscribe((e: any) =>{
      console.log(e);
      this.blogListing();
    });
  }
}
