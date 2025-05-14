import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { AuthService } from 'src/app/core/service/auth/auth.service';

@Component({
  selector: 'app-verify-user',
  templateUrl: './verify-user.component.html',
  styleUrls: ['./verify-user.component.scss']
})
export class VerifyUserComponent implements OnInit {

  @ViewChild("verifyUser", { static: false }) VerifyUserModal: TemplateRef<any>;

  public closeResult: string;
  public modalOpen: boolean = false;
  credentials: FormGroup;
  unvuser = null;
  loading = false;
  constructor(@Inject(PLATFORM_ID) private platformId: Object,
    private modalService: NgbModal,  private fb: FormBuilder,
    private authS: AuthService,
    private router: Router
    ) {
      this.credentials = this.fb.group({
        email: [''],
        otp: ['', [Validators.required, Validators.minLength(6)]],
      });

     }

  ngOnInit(): void {
    if(localStorage.getItem("unverified-user") ){
      this.unvuser = JSON.parse(localStorage.getItem("unverified-user"));
      this.credentials.patchValue({email: this.unvuser.email})
    }
  }


  submit() {
  this.loading = true;
  console.log(this.credentials.value);

  this.authS.verifyUser(this.unvuser._id, this.credentials.value).subscribe(
    (res) => {
      this.loading = false;
      this.router.navigate(['/']);
      this.modalService.dismissAll();
      this.credentials.reset({ email: '', otp: '' });
    },
    (error) => {
      this.loading = false;
      console.log('Verification error:', error);

      // Customize the error message based on server response
      if (error?.error?.message === 'Invalid OTP'||error.status === 401) {
        alert('Wrong OTP, try again.');
      } else {
        alert('Signup failed. Please try again.');
      }
    }
  );
}

  openModal() {
    if (isPlatformBrowser(this.platformId)) { // For SSR 
      this.modalService.open(this.VerifyUserModal, { 
        size: 'lg',
        ariaLabelledBy: 'VerifyUser-Modal',
        centered: true,
        windowClass: 'theme-modal VerifyUserm VerifyUserModal'
      }).result.then((result) => {
        this.modalOpen = true;
        `Result ${result}`
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  ngOnDestroy() {
    if(this.modalOpen){
      this.modalService.dismissAll();
    }
  }

}
