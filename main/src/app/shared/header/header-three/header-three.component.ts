import { Component, OnInit, Input, HostListener } from '@angular/core';
import { AuthService } from 'src/app/core/service/auth/auth.service';

@Component({
  selector: 'app-header-three',
  templateUrl: './header-three.component.html',
  styleUrls: ['./header-three.component.scss']
})
export class HeaderThreeComponent implements OnInit {

  @Input() class: string = 'header-2';
  @Input() themeLogo: string = '/assets/images/icon/toosie-resized.png'; // Default Logo
  @Input() topbar: boolean = true; // Default True
  @Input() sticky: boolean = false; // Default false
  user = JSON.parse(localStorage.getItem('current-user'));
  public stick: boolean = false;
  isAdmin = false;
  isSeller = false;
  isAuthenticated = false;

  constructor(private authS: AuthService) { }

  ngOnInit(): void {
    this.authS.isAuthenticated.subscribe(val => this.isAuthenticated = val);
    const userType = this.authS.currentUser().userType;

    // Check if the user is an Admin or Seller
    this.isAdmin = userType?.toLowerCase() === 'admin';
    this.isSeller = userType?.toLowerCase() === 'seller';
  }

  // @HostListener Decorator
  @HostListener("window:scroll", [])
  onWindowScroll() {
    let number = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    if (number >= 150 && window.innerWidth > 400) { 
      this.stick = true;
    } else {
      this.stick = false;
    }
  }

  logout() {
    this.authS.logout();
  }

  // Check if the user is either Admin or Seller
  isAdminOrSeller(): boolean {
    return this.isAdmin || this.isSeller;
  }

}
