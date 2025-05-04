import { Component, OnInit, ViewChild } from "@angular/core";
import { DatatableComponent } from "@swimlane/ngx-datatable";
import { OrderService } from "../../../shared/services/order.service";
import { ToastrService } from "ngx-toastr";
import { ExportServiceService } from "src/app/core/service/export-service/export-service.service";

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
  public combinedOrders = []; // Declare the new combinedOrders property

  user = JSON.parse(localStorage.getItem('current-user'));
  isSeller = this.user?.userType === 'seller';
  isUser = this.user?.userType === 'user';
  isAdmin = this.user?.userType === 'admin';

  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;

  constructor(
    private orderS: OrderService,
    private exportS: ExportServiceService,
    private toastrService: ToastrService
  ) {}

  public settings = {
    columns: {
      paymentId: {
        title: "Transaction ID",
      },
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
        title: "Order Status",
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
      totalCost: {
        title: "Total Cost",
      },
    },
  };

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.orderS.getAllOrders().subscribe((res: any) => {
      // Filter orders based on current user
      const userId = this.user?._id;
      let filteredOrders = res.data;

      if (this.isUser || this.isSeller || this.isAdmin) {
        filteredOrders = res.data.filter(order => order?.customerId._id === userId);
      }

      const sortedOrders = filteredOrders.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      this.mainOrder = sortedOrders;
      this.orderS.allOrder.next(sortedOrders);

      // Merge all categories of orders
      const allOrders = [
        ...this.formatData(sortedOrders.filter(e => e.paymentStatus === 'pending')), // Pending Payment
        ...this.formatData(sortedOrders.filter(e => e.deliveryStatus === 'pending')), // Pending Delivery
        ...this.formatData(sortedOrders.filter(e => e.shipping?.city?.trim().toLowerCase() === "store pickup" || e.shipping?.state?.trim().toLowerCase() === "store pickup")), // Store Pickup
        ...this.formatData(sortedOrders.filter(e => e.shipping?.city?.trim().toLowerCase() === "lagos" || e.shipping?.state?.trim().toLowerCase() === "lagos")), // Lagos
        ...this.formatData(sortedOrders.filter(e => e.shipping?.city?.trim().toLowerCase() === "abuja" || e.shipping?.state?.trim().toLowerCase() === "abuja")), // Abuja
        ...this.formatData(sortedOrders.filter(e => e.shipping?.city?.trim().toLowerCase() === "kano" || e.shipping?.state?.trim().toLowerCase() === "kano")), // Kano
        ...this.formatData(sortedOrders.filter(e => e.priorityDelivery === true)), // Priority Orders
        ...this.formatData(sortedOrders.filter(e => e.deliveryStatus === 'delivered')) // Completed Orders
      ];

      // Remove duplicates (if an order appears in multiple categories)
      this.combinedOrders = this.removeDuplicates(allOrders); // Store the combined result here

      // Continue with the existing data formatting logic for other categories
      this.storePickupOrder = this.formatData(sortedOrders.filter(e =>
        e.shipping?.city?.trim().toLowerCase() === "store pickup" ||
        e.shipping?.state?.trim().toLowerCase() === "store pickup"
      ));

      this.lagosOrder = this.formatData(sortedOrders.filter(e =>
        e.shipping?.city?.trim().toLowerCase() === "lagos" ||
        e.shipping?.state?.trim().toLowerCase() === "lagos"
      ));

      this.abujaOrder = this.formatData(sortedOrders.filter(e =>
        e.shipping?.city?.trim().toLowerCase() === "abuja" ||
        e.shipping?.state?.trim().toLowerCase() === "abuja"
      ));

      this.kanoOrder = this.formatData(sortedOrders.filter(e =>
        e.shipping?.city?.trim().toLowerCase() === "kano" ||
        e.shipping?.state?.trim().toLowerCase() === "kano"
      ));

      this.priorityOrder = this.formatData(sortedOrders.filter(e => e.priorityDelivery === true));
      this.completedOrder = this.formatData(sortedOrders.filter(e => e.deliveryStatus === 'delivered'));

      this.order = sortedOrders.map((e) => {
        return {
          id: e._id,
          ["Payment Id"]: e.paymentId.slice(0, 8),
          ["Payment Method"]: e.paymentMethod === "pod" ? "Payment on Delivery" : this.toTitleCase(e.paymentMethod),
          ["Payment Status"]: this.toTitleCase(e.paymentStatus),
          ["Delivery Status"]: this.toTitleCase(e.deliveryStatus),
          ["Products"]: e.products.map((s) => s.title).join(", "),
          ["Total Cost"]: e.totalCost,
        };
      });
    });
  }

  // Utility function to remove duplicate orders (if any)
  removeDuplicates(orders) {
    const seen = new Set();
    return orders.filter(order => {
      const isDuplicate = seen.has(order.id);
      seen.add(order.id);
      return !isDuplicate;
    });
  }

  // Helper method to format order data
  formatData(res) {
    if (res.length > 0) {
      return res.map((e) => {
        return {
          id: e._id,
          createdAt: new Date(e.createdAt).toLocaleDateString() + ', Time ' + new Date(e.createdAt).toLocaleTimeString(),
          paymentId: e.paymentId.slice(0, 8),
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

  // Helper method for title case
  toTitleCase(str) {
    return str.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }

  // Method to map products to HTML
  productFactory(p, product) {
    return p.map((e, i) => {
      return `<span><b> ${e?.quantity}</b> ${product[i]?.title}  </span>`;
    });
  }
}
