import { AuthService } from "./../../../../core/service/auth/auth.service";
import { Component, OnInit } from "@angular/core";
import * as e from "express";
import { ToastrService } from "ngx-toastr";
// import { userListDB } from 'src/app/shared/tables/list-users';

@Component({
  selector: "app-list-user",
  templateUrl: "./list-user.component.html",
  styleUrls: ["./list-user.component.scss"],
})
export class ListUserComponent implements OnInit {
  public user_list = [];
  referrals: any;

  constructor(private authS: AuthService, private toastS: ToastrService) {
    this.user_list = [];
  }

  public settings = {
    actions: {
      edit: false,
      add: false,
      position: "right",
    },
    delete: {
      confirmDelete: true,

      deleteButtonContent: "Delete data",
      saveButtonContent: "save",
      cancelButtonContent: "cancel",
    },
    edit: {
      editButtonContent: `'<i class="fas fa-pencil-alt fa-fw"></i>'`,
      saveButtonContent: '<i class="fas fa-check fa-fw"></i>',
      cancelButtonContent: '<i class="fas fa-times fa-fw"></i>',
      confirmSave: true,
    },
    columns: {
      fullName: {
        title: "Name",
      },
      email: {
        title: "Email",
      },
      phone: {
        title: "Phone",
      },
      userType: {
        title: "Role",
      },
      id: {
        title: "Edit",
        type: "html",
      },
    },
  };
  public referralSettings = {
    actions: {
      edit: false,
      add: false,
      delete: false,
      position: "right",
    },
    delete: {
      confirmDelete: true,

      deleteButtonContent: "Delete data",
      saveButtonContent: "save",
      cancelButtonContent: "cancel",
    },
    // edit: {
    //   editButtonContent: `'<i class="fas fa-pencil-alt fa-fw"></i>'`,
    //   saveButtonContent: '<i class="fas fa-check fa-fw"></i>',
    //   cancelButtonContent: '<i class="fas fa-times fa-fw"></i>',
    //   confirmSave: true
    // },
    columns: {
      referrer: {
        title: "Referer name",
      },
      referrerToken: {
        title: "Referrer token",
      },
      referee: {
        title: "Referee name",
      },
      createdAt: {
        title: "Created at",
      },
    },
  };

  ngOnInit() {
    this.loadUsers();
  }
  loadUsers() {
    this.authS.getUsers().subscribe((res) => {
      this.user_list = res.data.map((e) => {
        return {
          ...e,
          userType: e.userType.toUpperCase(),
          id: `
          <a href=dashboard/main/users/edit-user/${e._id} class="ng2-smart-action ng2-smart-action-edit-edit ng-star-inserted"><a/>
          `,
        };
      });
      console.log(res);
    });
    this.authS.getReferrals().subscribe((res) => {
      this.referrals = res.data
        .filter((e) => e.referee !== null)
        .map(({ createdAt, referee, referrer }) => ({
          createdAt: new Date(createdAt)?.toLocaleDateString(),
          referee: referee?.fullName,
          referrer: referrer?.fullName,
          referrerToken: referrer?.referrerToken,
        }));
      console.log(res);
    });
  }
  onDeleteConfirm(event) {
    if (window.confirm("Are you sure you want to delete?")) {
      this.authS.deleteUser(event.data._id).subscribe((e) => {
        event.confirm.resolve();
        this.toastS.success("Successfully deleted user");
        console.log(e);
        this.loadUsers();
      });
    } else {
      event.confirm.reject();
    }
  }
}
