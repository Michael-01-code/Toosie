import { Component, OnInit } from "@angular/core";
import { SwPush } from "@angular/service-worker";
import { RequestService } from "../core/request/request.service";
import { ToastrService } from "ngx-toastr";
import { baseEndpoints } from "../core/config/endpoints";
@Component({
  selector: "app-admin-dashboard",
  templateUrl: "./admin-dashboard.component.html",
  styleUrls: ["./admin-dashboard.component.scss"],
})
export class AdminDashboardComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
  }


}
