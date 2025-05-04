import { InventoryService } from "src/app/core/service/inventory/inventory.service";
import { Component, OnInit } from "@angular/core";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { digitalCategoryDB } from "src/app/admin-dashboard/shared/tables/digital-category";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { EditCategoryComponent } from "../edit-category/edit-category.component";

@Component({
  selector: "app-digital-category",
  templateUrl: "./digital-category.component.html",
  styleUrls: ["./digital-category.component.scss"],
})
export class DigitalCategoryComponent implements OnInit {
  public closeResult: string;
  public digital_categories = [];
  public categories = [];
  categoryForm: FormGroup;
  files: File[] = [];
  hide = true;
  loading = false;

  constructor(
    private modalService: NgbModal,
    private invS: InventoryService,
    private fb: FormBuilder
  ) {
    this.digital_categories = digitalCategoryDB.digital_category;
    this.categoryForm = this.fb.group({
      category: ["", [Validators.required]],
    });
    this.loadCategory();
  }
  onSelect(event) {
    console.log(event);
    this.files.push(...event.addedFiles);
  }

  onRemove(event) {
    console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }

  open(content) {
    this.modalService
      .open(content, { ariaLabelledBy: "modal-basic-title" })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return "by pressing ESC";
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return "by clicking on a backdrop";
    } else {
      return `with: ${reason}`;
    }
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
      editButtonContent: `H1`,
      saveButtonContent: '<i class="fas fa-check fa-fw"></i>',
      cancelButtonContent: '<i class="fas fa-times fa-fw"></i>',
      confirmSave: true,
    },
    columns: {
      categoryImage: {
        title: "Image",
        type: "html",
      },
      category: {
        title: "Name",
      },
      action: {
        title: "Action",
        type: "custom",
        renderComponent: EditCategoryComponent,
        // editor: {
        //   type: 'custom',
        //   component: EditCategoryComponent,
        // },
      },
    },
  };

  ngOnInit() {
    this.loadCategory;
  }
  loadCategory() {
    this.invS.allCategories().subscribe((e: any) => {
      console.log(e.data);
      this.categories = e.data.map((e) => {
        return {
          ...e,
          catImg: e.categoryImage,
          action: `<button class='btn btn-primary'>Hello</button>`,
          categoryImage: `<img src=${e?.categoryImage} class='imgTable'>`,
        };
      });
    });
  }

  saveCategory() {
    this.loading = true;
    var data = new FormData();
    // data.append('category', this.title?.value);
    data.append("upload", this.files[0]);
    this.invS.uploadMedia(data).subscribe((res) => {
      const obj = {
        category: this.category?.value,
        categoryImage: res?.images[0],
      };
      this.invS.createCategory(obj).subscribe((inv) => {
        console.log(inv);
        this.loading = false;
        this.files = [];
        this.loadCategory();
        this.modalService.dismissAll();
        this.categoryForm.reset();
      });
    });
  }
  onDeleteConfirm(event) {
    console.log("Delete Event In Console");
    console.log(event);
    if (window.confirm("Are you sure you want to delete?")) {
      this.invS.deleteCategory(event.data._id).subscribe((e) => {
        event.confirm.resolve();
        console.log(e);
      });
    } else {
      event.confirm.reject();
    }
  }

  get category() {
    return this.categoryForm.get("category");
  }

  get brand() {
    return this.categoryForm.get("brand");
  }
}
