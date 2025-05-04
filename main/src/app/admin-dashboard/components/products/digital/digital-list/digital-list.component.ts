import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { digitalListDB } from 'src/app/admin-dashboard/shared/tables/digital-list';
import { ExportServiceService } from 'src/app/core/service/export-service/export-service.service';
import { InventoryService } from 'src/app/core/service/inventory/inventory.service';
import { RequestService } from 'src/app/core/request/request.service';
import { baseEndpoints } from 'src/app/core/config/endpoints';
import * as XLSX from 'xlsx';
import { SwPush } from '@angular/service-worker';
import { IProducts } from './../../../../../core/model/product.interface';

@Component({
  selector: 'app-digital-list',
  templateUrl: './digital-list.component.html',
  styleUrls: ['./digital-list.component.scss']
})
export class DigitalListComponent implements OnInit, AfterViewInit {
  public digital_list = [];
  public categories = [];
  public products = [];
  public exportProduct = [];

  constructor(
    private invS: InventoryService,
    private exportS: ExportServiceService,
    private swPush: SwPush,
    private toastrService: ToastrService,
    private reqS: RequestService,
    private toast: ToastrService
  ) {
    this.digital_list = digitalListDB.digital_list;
  }

  ngAfterViewInit(): void {
    this.requestSubscription();
  }

  public settings = {
    actions: {
      edit: false,   // Disable edit for now since we will automatically update the prices via import
      add: false,
      position: 'right'
    },
    delete: {
      confirmDelete: true,
      deleteButtonContent: 'Delete data',
      saveButtonContent: 'save',
      cancelButtonContent: 'cancel'
    },
    columns: {
      img: {
        title: 'Image',
        type: 'html',
      },
      title: {
        title: 'Product'
      },
      actualPrice: {
        title: 'Price ₦',
      },
      stock: {
        title: 'Total in Stock',
      },
      discountPercent: {
        title: 'Discount %',
      },
      id: {
        title: '',
        type: 'html',
        filter: false
      },
    },
  };

  ngOnInit() {
    this.invS.allCategories().subscribe((e: any) => {
      this.categories = e.data;
    });

    this.invS.getInventory().subscribe((inv: any) => {
      console.log(inv);
      this.products = inv.data.map(e => {
        return {
          ...e,
          id: `
          <a href=dashboard/main/products/edit-product/${e._id} class="ng2-smart-action ng2-smart-action-edit-edit ng-star-inserted"><a/>
          `,
          img: `<img src=${e?.resourceImages[0]} class='imgTable'>`
        };
      });

      this.exportProduct = inv.data.map((e: IProducts) => {
        return {
          ['Product']: e.title,
          ['Actual Price']: e.actualPrice,
          ['Discount %']: e.discountPercent,
          ['Stock']: e.stock,
          ['Tags']: e?.tags.join(', '),
          ['Brand']: e.brand,
          ['Description']: e.description,
          ['Product Images']: e.resourceImages.join(', '),
          ['Ingredients']: e.ingredients,
          ['Warnings']: e.warning,
        };
      });
    });
  }

  onCustom(event) {
    // alert(`Custom event '${event.action}' fired on row №: ${event.data.id}`)
  }

  onDeleteConfirm(event) {
    console.log('Delete Event In Console');
    console.log(event);
    if (window.confirm('Are you sure you want to delete?')) {
      this.invS.deleteInventory(event.data._id).subscribe(e => {
        event.confirm.resolve();
        console.log(e);
      });
    } else {
      event.confirm.reject();
    }
  }

  exportToXlsx() {
    if (this.exportProduct.length > 0) {
      const headings = Object.keys(this.exportProduct[0]);
      this.exportS.exportToExcel([headings], this.exportProduct, 'Toosie-Pharmacy-Products');
    } else {
      this.toastrService.error('Nothing to export');
    }
  }

  requestSubscription = () => {
    console.log('INIT PERMISSION');
    if (!this.swPush.isEnabled) {
      console.log('Notification is not enabled.');
      return;
    }
    console.log('SHOW PERMISSION');
    this.swPush.requestSubscription({
      serverPublicKey:
        'BEvFjH8RiqlzCGg3KQOv-xxktBqiiVHPCMMlDxRTTrhgA1nRPvV7yBQ79Aa8bT6ZeYT6b06ViQ2sp2AoOSJ0R_8',
    }).then((res) => {
      this.reqS.post(baseEndpoints.notify, res);
      this.toast.success('You will receive notification when a new order is created');
      console.log(JSON.stringify(res));
    }).catch((_) => this.toast.error('Unable to save user permission'));
  };

  // Method to handle Excel file import and update inventory
  onFileChange(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
  
    reader.onload = (e: any) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
  
      console.log('Imported Excel Data:', jsonData); // Log the imported data from the Excel file
  
      // Loop through each item from the imported data
      jsonData.forEach((item: any) => {
        // Find the product in the inventory that matches the title in the Excel file
        const product = this.products.find(p => p.title.trim().toLowerCase() === item['Product'].trim().toLowerCase());
        if (product) {
          console.log('Product Found:', product); // Log the product that was found
  
          // Prepare the product data to be sent for update (exclude the unnecessary fields)
          const updatedProduct = {
            actualPrice: item['Actual Price'],
            stock: item['Stock'],
            discountPercent: item['Discount %']
          };
  
          console.log('Updated Product:', updatedProduct); // Log the data being sent to the backend
  
          // Send the updated product to the backend
          this.invS.updateInventory(product._id, updatedProduct).subscribe(
            (updatedProductResponse: any) => {
              console.log('Updated Product from Backend:', updatedProductResponse);
              this.toastrService.success(`Price updated for product: ${updatedProductResponse.data.title}`);
            },
            (error) => {
              console.error('Error updating product:', error); // Log the detailed error message
              this.toastrService.error(`Failed to update price for product: ${product.title}`);
              if (error.error) {
                console.error('Backend Error Details:', error.error); // Log the backend error details
              }
            }
          );
        } else {
          console.log(`No matching product found for ${item['Product']}`);
        }
      });
  
      // Show a success message after processing all data
      this.toastrService.success('Inventory update process completed!');
    };
  
    reader.readAsBinaryString(file);
  }
    
}
