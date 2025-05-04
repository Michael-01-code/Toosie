import { Injectable, HostListener, Inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { WINDOW } from "./windows.service";

// Menu interface
export interface Menu {
  path?: string;
  title?: string;
  icon?: string;
  type?: string;
  badgeType?: string;
  badgeValue?: string;
  active?: boolean;
  bookmark?: boolean;
  children?: Menu[];
}

@Injectable({
  providedIn: 'root',
})

export class NavService {

  public screenWidth: any;
  public collapseSidebar: boolean = false;

  private user = JSON.parse(localStorage.getItem("current-user")); // Get current user from localStorage

  constructor(@Inject(WINDOW) private window) {
    this.onResize();
    if (this.screenWidth < 991) {
      this.collapseSidebar = true;
    }
  }

  // Window width change listener
  @HostListener("window:resize", ['$event'])
  onResize(event?) {
    this.screenWidth = window.innerWidth;
  }

  // Menu items
  MENUITEMS: Menu[] = [
    {
      title: 'Products', icon: 'box', type: 'sub', active: false, children: [
        { path: 'products/product-list', title: 'Product List', type: 'link' },
        { path: 'products/add-product', title: 'Add Product', type: 'link' },
      ]
    },
    { 
      title: 'Category', icon: 'archive', type: 'sub', active: false, children: [
        { path: 'category/list', title: 'Category', type: 'link' },
      ] 
    },
    {
      title: 'Sales', icon: 'dollar-sign', type: 'sub', active: false, children: [
        { path: 'sales/orders', title: 'Orders', type: 'link' },
      ]
    },
    {
      title: 'Banners', icon: 'tag', type: 'sub', active: false, children: [
        { path: 'banners/list', title: 'Banners', type: 'link' },
        { path: 'banners/create-banners', title: 'Parallax', type: 'link' },
      ]
    },
    {
      title: 'Blogs', icon: 'clipboard', type: 'sub', active: false, children: [
        { path: 'blog/blog-list', title: 'List Blog', type: 'link' },
        { path: 'blog/add-blog', title: 'Create Blog', type: 'link' },
      ]
    },
    {
      title: 'Users', icon: 'user-plus', type: 'sub', active: false, children: [
        { path: 'users/list-user', title: 'User List', type: 'link' },
      ]
    },
    {
      title: 'Prescription', icon: 'user-plus', type: 'sub', active: false, children: [
        { path: 'prescriptions/list', title: 'Prescription List', type: 'link' },
      ]
    },
  ];

  // Filter menu items based on user type (Admin or Seller)
  filterMenuByUserRole(user: any): Menu[] {
    if (user?.userType === 'admin') {
      return this.MENUITEMS; // Admin sees all menu items
    }

    if (user?.userType === 'seller') {
      // Sellers should only see the Sales section
      return [
        this.MENUITEMS.find(item => item.title === 'Sales'),
        this.MENUITEMS.find(item => item.title === 'Prescription') // Only the "Sales" menu // Only the "Sales" menu
      ];
    }

    return []; // Default behavior for non-logged-in users
  }

  // Observable to track the menu items
  items = new BehaviorSubject<Menu[]>(this.filterMenuByUserRole(this.user));
}
