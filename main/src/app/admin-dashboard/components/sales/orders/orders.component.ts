import { OrderService } from "./../../../../shared/services/order.service";
import { InventoryService } from "src/app/core/service/inventory/inventory.service";
import { Component, OnInit, ViewChild } from "@angular/core";
import { DatatableComponent } from "@swimlane/ngx-datatable";
import { orderDB } from "../../../shared/tables/order-list";
import { ToastrService } from "ngx-toastr";
import { ExportServiceService } from "src/app/core/service/export-service/export-service.service";
import { ViewOrderComponent } from "../view-order/view-order.component";

@Component({
  selector: "app-orders",
  templateUrl: "./orders.component.html",
  styleUrls: ["./orders.component.scss"],
})
export class OrdersComponent implements OnInit {
  public order = [];
  lagosOrder = [];
  abujaOrder = [];
  storePickupOrder = [];
  priorityOrder = [];
  kanoOrder = [];
  pendingDelivery = [];
  pendingPayment = [];
  completedOrder = [];
  public temp = [];
  public mainOrder = [];

  user = JSON.parse(localStorage.getItem('current-user'));
  isSeller = this.user?.userType === 'seller';

  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;

  constructor(
    private orderS: OrderService,
    private exportS: ExportServiceService,
    private toastrService: ToastrService
  ) {}

  public settings = {
    actions: {
      edit: true,
      delete: !this.isSeller, // disable delete for sellers
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
      editButtonContent: `'<i class="fas fa-pencil-alt fa-fw mx-2"></i>'`,
      saveButtonContent: '<i class="fa fa-check-circle mx-2"></i>',
      cancelButtonContent: '<i class="fas fa-times fa-fw mx-2"></i>',
      confirmSave: true,
    },
    columns: {
      createdAt: {
        title: "Order Date",
      },
      products: {
        title: "Product",
        type: "html",
      },
      paymentStatus: {
        title: "Payment Status",
        type: "html",
        editor: {
          type: "list",
          config: {
            list: [
              { value: "pending", title: "Pending" },
              { value: "paid", title: "Paid" },
            ],
          },
        },
      },
      paymentMethod: {
        title: "Payment Method",
      },
      deliveryStatus: {
        title: "Delivery Status",
        editor: {
          type: "list",
          config: {
            list: [
              { value: "pending", title: "Pending" },
              { value: "delivered", title: "Delivered" },
            ],
          },
        },
      },
      paymentId: {
        title: "Prioriity Delivery",
      },
      totalCost: {
        title: "Total Cost",
      },
      view: {
        title: "View Order",
        filter: false,
        type: "custom",
        renderComponent: ViewOrderComponent,
      },
    },
  };

  updateFilter(event) {
    const val = event.target.value.toLowerCase();

    const temp = this.temp.filter(function (d) {
      return d.name.toLowerCase().indexOf(val) !== -1 || !val;
    });

    this.order = temp;
    this.table.offset = 0;
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.orderS.getAllOrders().subscribe((res: any) => {
      const sortedOrders = res.data.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      this.mainOrder = sortedOrders;
      this.orderS.allOrder.next(sortedOrders);

      this.storePickupOrder = this.formatData(
        sortedOrders.filter(
          (e) =>
            e.shipping?.city?.trim().toLowerCase() === "store pickup" ||
            e.shipping?.state?.trim().toLowerCase() === "store pickup"
        )
      );
      this.lagosOrder = this.formatData(
        sortedOrders.filter(
          (e) =>
            e.shipping?.city?.trim().toLowerCase() === "lagos" ||
            e.shipping?.state?.trim().toLowerCase() === "lagos"
        )
      );
      this.abujaOrder = this.formatData(
        sortedOrders.filter(
          (e) =>
            e.shipping?.city?.trim().toLowerCase() === "abuja" ||
            e.shipping?.state?.trim().toLowerCase() === "abuja"
        )
      );
      this.kanoOrder = this.formatData(
        sortedOrders.filter(
          (e) =>
            e.shipping?.city?.trim().toLowerCase() === "kano" ||
            e.shipping?.state?.trim().toLowerCase() === "kano"
        )
      );
      this.priorityOrder = this.formatData(
        sortedOrders.filter((e) => e.priorityDelivery === true)
      );
      this.pendingPayment = this.formatData(
        sortedOrders.filter((e) => e.paymentStatus === 'pending')
      );
      this.pendingDelivery = this.formatData(
        sortedOrders.filter((e) => e.deliveryStatus === 'pending')
      );
      this.completedOrder = this.formatData(
        sortedOrders.filter((e) => e.deliveryStatus === 'delivered')
      );

      this.order = sortedOrders.map((e) => {
        return {
          id: e._id,
          ["Payment Id"]: e.paymentId.slice(0, 8),
          ["Payment Method"]:
            e.paymentMethod === "pod"
              ? "Payment on Delivery"
              : this.toTitleCase(e.paymentMethod),
          ["Payment Status"]: this.toTitleCase(e.paymentStatus),
          ["Delivery Status"]: this.toTitleCase(e.deliveryStatus),
          ["Products"]: e.products.map((s) => s.title).join(", "),
          ["Total Cost"]: (e.totalCost),
        };
      });
    });
  }

  productFactory(p, product) {
    return p.map((e, i) => {
      return `<span><b> ${e?.quantity}</b> ${product[i]?.title}  </span>`;
    });
  }

  formatData(res) {
    if (res.length > 0) {
      return res.map((e) => {
        return {
          id: e._id,
          createdAt: new Date(e.createdAt).toLocaleDateString() + ', Time ' + new Date(e.createdAt).toLocaleTimeString(),
          paymentId: e.priorityDelivery,
          paymentMethod:
            e.paymentMethod === "pod"
              ? "Payment on Delivery"
              : this.toTitleCase(e.paymentMethod),
          paymentStatus: this.toTitleCase(e.paymentStatus),
          deliveryStatus: this.toTitleCase(e.deliveryStatus),
          products: this.productFactory(e.orderDetails, e.products),
          totalCost: e.totalCost,
        };
      });
    } else {
      return [];
    }
  }

  onEditConfirm(event) {
    if (window.confirm("Are you sure you want to update?")) {
      const { id, ...res } = event.newData;
      const edit = this.mainOrder.filter((o) => o.id === id)[0];
      const newObj = {
        deliveryStatus: res.deliveryStatus.toLowerCase(),
        paymentStatus: res.paymentStatus.toLowerCase(),
        paymentMethod:
          res.paymentMethod === "Payment on Delivery" ? "pod" : "card",
      };
      this.orderS.updateOrder(id, newObj).subscribe(() => {
        this.loadData();
        this.toastrService.success("Order has been updated");
      });
    } else {
      event.confirm.reject();
    }
  }

  onDeleteConfirm(event) {
    if (window.confirm("Are you sure you want to delete this order?")) {
      const { id } = event.data;
      this.orderS.deleteOrder(id).subscribe(() => {
        this.loadData();
        this.toastrService.success("Order has been deleted");
      });
    } else {
      event.confirm.reject();
    }
  }

  toTitleCase(str) {
    return str.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }

  exportToXlsx() {
    if (this.order.length > 0) {
      const headings = Object.keys(this.order[0]);
      this.exportS.exportToExcel([headings], this.order, 'Toosie-Pharmacy-order');
    } else {
      this.toastrService.error("Nothing to export");
    }
  }
}
