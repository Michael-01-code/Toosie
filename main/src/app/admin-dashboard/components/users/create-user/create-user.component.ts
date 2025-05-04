import { AuthService } from 'src/app/core/service/auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent implements OnInit {
  public accountForm: FormGroup;
  public permissionForm: FormGroup;
  user: any = {}
  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private authS: AuthService) {
    this.createAccountForm();
    this.createPermissionForm();
  }

  createAccountForm() {

    this.accountForm = this.formBuilder.group({
      fullName: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      userType: ['', [Validators.required, Validators.email]],
    })
  }
  createPermissionForm() {
    this.permissionForm = this.formBuilder.group({
    })
  }

  ngOnInit() {
    const id = this.route.snapshot.params.id


    this.authS.getUser(id).subscribe(res =>{
      console.log(res)
      this.user = res.data
      this.accountForm.patchValue({
        ...res.data
      })
    })
  }
  submitForm(){
    const id = this.route.snapshot.params.id
    if(id){
      const obj = {
        ...this.accountForm.value
      }
      this.authS.updateUser(id, obj).subscribe(e =>{
        console.log(e)
      })
    }
  }

}
