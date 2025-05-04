import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  userDetails = {
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    message: ''
  };

  shippingAddress = {
    plot: '',
    address: '',
    zipCode: '',
    country: 'Nigeria',
    city: '',
    region: ''
  };

  constructor() {}

  ngOnInit(): void {
    const savedUser = localStorage.getItem('userDetails');
    const savedAddress = localStorage.getItem('shippingAddress');

    if (savedUser) {
      this.userDetails = JSON.parse(savedUser);
    }

    if (savedAddress) {
      this.shippingAddress = JSON.parse(savedAddress);
    }
  }

  saveSettings(): void {
    localStorage.setItem('userDetails', JSON.stringify(this.userDetails));
    localStorage.setItem('shippingAddress', JSON.stringify(this.shippingAddress));
    alert('Settings saved locally!');
  }
}
