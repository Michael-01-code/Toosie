import { Injectable } from "@angular/core";
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { AuthService } from "../service/auth/auth.service";

@Injectable({
  providedIn: "root"
})
export class SellerGuard implements CanActivate {
  constructor(private authS: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const user: any = JSON.parse(localStorage.getItem("current-user"));
    
    // Ensure user is authenticated and is a seller
    if (this.authS.userAuthenticated() && user?.userType === "seller") {
      // Check if the user is trying to access any page other than sales orders
      const isAccessingPermittedPage = state.url === '/dashboard/main/sales/orders' || state.url === '/dashboard/main/prescription';
      

      if (isAccessingPermittedPage) {
        return true;
      } else {
        // Redirect sellers to the sales orders page if they try to access any other route
        this.router.navigate(["/dashboard/main/sales/orders"]);
        return false;
      }
    }

    // Redirect to login if the user is not a seller or not authenticated
    this.router.navigate(["/pages/login"]);
    return false;
  }
}
