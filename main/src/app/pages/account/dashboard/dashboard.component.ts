import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public openDashboard: boolean = false;
  public user: any;  // This will hold the current user's data

  constructor() { }

  ngOnInit(): void {
    // Retrieve the user data from localStorage (or a service if needed)
    this.user = JSON.parse(localStorage.getItem('current-user'));

    if (!this.user) {
      // Redirect to login or show an error if no user data is found
      console.log("User not found, please log in.");
      // You can add a redirect to the login page here
    }
  }

  // Toggle the dashboard sidebar visibility
  ToggleDashboard() {
    this.openDashboard = !this.openDashboard;
  }

  // Method to check if the current user is a seller
  isSeller(): boolean {
    return this.user?.userType === 'seller';
  }

  // Method to check if the current user is an admin
  isAdmin(): boolean {
    return this.user?.userType === 'admin';
  }
}
