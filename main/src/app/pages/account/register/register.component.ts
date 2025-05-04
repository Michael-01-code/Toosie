import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/core/service/auth/auth.service';
import { NewsletterComponent } from 'src/app/shared/components/modal/newsletter/newsletter.component';
import { QuickViewComponent } from 'src/app/shared/components/modal/quick-view/quick-view.component';
import { VerifyUserComponent } from 'src/app/shared/components/modal/verify-user/verify-user.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  credentials: FormGroup;
  hide = true;
  loading = false;
  @ViewChild("verifyUser") verifyUser: VerifyUserComponent;

 
  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    ) {
      this.credentials = this.fb.group({
        fullName: ['', [Validators.required]],
        phone: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
      });

     }

  ngOnInit() {

  }


  async login() {
    this.loading = true;
    
    // First, verify the user
    this.verifyUser.openModal();
  
    // After verification, sign up
    this.authService.signup(this.credentials.value).subscribe(
      async (res) => {
        this.loading = false;
        // this.router.navigate(['/']);
      },
      async (res) => {
        this.loading = false;
        console.log(res);
        alert('signup failed');
      }
    );
  }
  

  // Easy access for form fields
  get fullName() {
    return this.credentials.get('fullName');
  }

  get email() {
    return this.credentials.get('email');
  }

  get password() {
    return this.credentials.get('password');
  }
  get phone() {
    return this.credentials.get('phone');
  }

}
