import { Injectable } from "@angular/core";
import { Router, CanActivate, ActivatedRouteSnapshot } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { AuthService } from "../service/auth/auth.service";

@Injectable({
  providedIn: "root",
})
export class RoleGuard implements CanActivate {
  private readonly salesRoute = "/dashboard/main/sales/orders";
  private readonly prescriptionRoute = "/dashboard/main/prescription";

  constructor(
    public authS: AuthService,
    public router: Router,
    private toastrService: ToastrService
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const userRaw = localStorage.getItem("current-user");
    const user: any = userRaw ? JSON.parse(userRaw) : null;

    // Check if the user is authenticated
    if (!this.authS.userAuthenticated() || !user) {
      this.router.navigate(["pages/login"]);
      return false;
    }

    // Admin has full access
    if (user.userType === "admin") {
      return true;
    }

    // Seller access control
    if (user.userType === "seller") {
      return true;
    }const fullPath = this.router.url;

      // Allow access only to the sales route ("/dashboard/main/sales/orders")
      if (fullPath === this.salesRoute || fullPath === this.prescriptionRoute) {
        return true;
      }

      // Block access to any other route in the dashboard
      this.toastrService.info("Access restricted to the Sales section only", "", {
        timeOut: 3000,
      });
      this.router.navigate([this.salesRoute]);
      return false;
    }
  }

