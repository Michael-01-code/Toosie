import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/core/service/auth/auth.service';
import { PrescriptionService } from 'src/app/core/service/prescription/prescription.service';
export interface PrescriptionObject {
  prescriptionImage: string;
  description?: any;
  response?: any;
  isActive: boolean;
  _id: string;
  createdAt: Date;
  id: string;
}
@Component({
  selector: 'app-prescription-history',
  templateUrl: './prescription-history.component.html',
  styleUrls: ['./prescription-history.component.scss']
})
export class PrescriptionHistoryComponent implements OnInit {

  prescriptionList: [];
  user: any = {}
  constructor(private pres: PrescriptionService, private authS: AuthService) { }

  public settings = {
    actions: {
      position: 'right'
    },
    columns: {
      prescriptionImage: {
        title: 'Prescription',
        type: 'html'
      },
      description: {
        title: 'Description',
      },
      createdAt: {
        title: 'Date'
      }
    },
  };
  ngOnInit() {
    this.user = this.authS.currentUser()
    this.pres.userPrescriptions(this.user._id).subscribe(e =>{
      console.log(e)
      this.prescriptionList = e.data.map(p => {
        return {
          ...p,
          createdAt: new Date(p.createdAt).toDateString(),
          prescriptionImage: `<img src=${p?.prescriptionImage} class='imgTable'>`
        }
      })
    });
  }

}
