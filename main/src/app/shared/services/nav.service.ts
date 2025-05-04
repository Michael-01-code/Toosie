import { Injectable, HostListener } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { InventoryService } from "src/app/core/service/inventory/inventory.service";

// Menu
export interface Menu {
  path?: string;
  title?: string;
  type?: string;
  megaMenu?: boolean;
  image?: string;
  active?: boolean;
  badge?: boolean;
  badgeText?: string;
  children?: Menu[];
}

@Injectable({
  providedIn: "root",
})
export class NavService {
  categories = [ ];
  LEFTMENUITEMS: Menu[] = [
    {
      title: "home",
      type: "link",
      path: "/home/main",
      active: false,
    },
    {
      title: "Prescription",
      type: "sub",
      active: false,
      children: [
        {
          path: "/prescription/upload-prescription",
          title: "upload prescription",
          type: "link",
        },
        {
          path: "/prescription/prescription-history",
          title: "prescription history",
          type: "link",
        },
      ],
    },
    {
      title: "blog",
      type: "link",
      path: "/home/blog",
      active: false,
    },
    {
      title: "contact",
      type: "link",
      path: "/pages/contact",
      active: false,
    },
  ];
  MENUITEMS: Menu[] = [
    {
      title: "home",
      type: "link",
      path: "/home/main",
      active: false,
    },
    {
      title: "Prescription",
      type: "sub",
      active: false,
      children: [
        {
          path: "/prescription/upload-prescription",
          title: "upload prescription",
          type: "link",
        },
        {
          path: "/prescription/prescription-history",
          title: "prescription history",
          type: "link",
        },
      ],
    },
    {
      title: "blog",
      type: "link",
      path: "/home/blog",
      active: false,
    },
    {
      title: "wishlist",
      type: "link",
      path: "/shop/wishlist",
      active: true,
    },
    {
      title: "contact",
      type: "link",
      path: "/pages/contact",
      active: false,
    },
  ];

  constructor(private invS: InventoryService) {
    this.loadCategory();
  }
  loadCategory() {
    console.log("NAV SERVICE");
    this.invS.allCategories().subscribe((e: any) => {
      console.log(e);
      this.categories = e.data.map((cat) => {
        return {
          path: "/shop/category/" + cat._id,
          title: cat.category,
          type: "link",
        };
      });
	  this.LEFTMENUITEMS.splice(1,0,     {
		title: "Categories",
		type: "sub",
		active: false,
		children: this.categories,
	  })
	  this.MENUITEMS.splice(1,0,    {
		title: "Categories",
		type: "sub",
		active: false,
		children: this.categories,
	  },)
	  this.leftMenuItems.next(this.LEFTMENUITEMS)
	  this.items.next(this.MENUITEMS)
    });
  }
  public screenWidth: any;
  public leftMenuToggle: boolean = false;
  public mainMenuToggle: boolean = false;

  // Windows width
  @HostListener("window:resize", ["$event"])
  onResize(event?) {
    this.screenWidth = window.innerWidth;
  }



  
  // Array
  items = new BehaviorSubject<Menu[]>(this.MENUITEMS);
  leftMenuItems = new BehaviorSubject<Menu[]>(this.LEFTMENUITEMS);
}
