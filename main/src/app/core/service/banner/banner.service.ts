import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { baseEndpoints, miscEndpoint } from '../../config/endpoints';
import { RequestService } from '../../request/request.service';

@Injectable({
  providedIn: 'root'
})
export class BannerService {

  BannerStore: BehaviorSubject<any> = new BehaviorSubject([]);
  singleBanner: BehaviorSubject<any> = new BehaviorSubject({});
  constructor(private reqS: RequestService) {
    this.BannerListing();
  }

  BannerListing(){
    this.reqS.get(baseEndpoints.banner).subscribe((e: any) =>{
      console.log(e);
      this.BannerStore.next(e.data);
    });
  }
  createBanner(data){
    return this.reqS.post(baseEndpoints.banner, data)
  }
  uploadMedia(formData): Observable<any> {
    return this.reqS.post(miscEndpoint.mediaUpload, formData);
  }
  deleteBanner(id){
    return this.reqS.delete(baseEndpoints.banner + '/' + id).subscribe((e: any) =>{
      console.log(e);
      this.BannerListing();
    });
  }
}
