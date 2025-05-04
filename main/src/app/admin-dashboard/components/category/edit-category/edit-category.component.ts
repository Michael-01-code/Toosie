import { ToastrService } from "ngx-toastr";
import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnInit,
  Input,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { DefaultEditor } from "ng2-smart-table";
import { InventoryService } from "src/app/core/service/inventory/inventory.service";

@Component({
  selector: "app-edit-category",
  templateUrl: "./edit-category.component.html",
  styleUrls: ["./edit-category.component.scss"],
})
export class EditCategoryComponent implements OnInit {
  closeResult: string;
  categoryForm: FormGroup;
  files = null;
  @Input() value: any;
  @Input() rowData: any;
  loading;
  catImage = null;
  imageReplaced: boolean = false;

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private invS: InventoryService,
    private toast: ToastrService
  ) {
    this.categoryForm = this.fb.group({
      category: ["", [Validators.required]],
    });
  }
  open(content) {
    console.log(this.rowData);
    this.category.setValue(this.rowData?.category);
    this.catImage = this.rowData.catImg;
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
  getDismissReason(reason: any) {
    console.log("Method not implemented.");
  }
  onSelect(event) {
    console.log(event);
    const list = event.addedFiles;
    this.files = list[list.length - 1];
  }

  replaceImage() {
    this.imageReplaced = true;
    this.catImage = null;
  }

  onRemove() {
    this.files = null;
  }

  updateCategory() {
    const obj: any = {
      category: this.category.value,
    };
    if (this.imageReplaced) {
      console.log("replaced", this.files);
      var data = new FormData();
    // data.append('category', this.title?.value);
    data.append("upload", this.files);
      this.invS.uploadMedia(data).subscribe((res) => {
        console.log(res);
        obj.categoryImage = res?.images[0];
        this.invS.updateCategory(this.rowData._id, obj).subscribe((e) => {
          console.log(e);
          this.modalService.dismissAll()
          this.toast.success("Category updated successfully");
          setTimeout(() => {
            location.reload()
          }, 3000);
        });
      });
    } else {
      obj.categoryImage = this.rowData.catImg;
      this.invS.updateCategory(this.rowData._id, obj).subscribe((e) => {
        console.log(e);
        this.toast.success("Category updated successfully");
        this.modalService.dismissAll()
        setTimeout(() => {
          location.reload()
        }, 3000);
      });
    }
  }

  ngOnInit(): void {}

  get category() {
    return this.categoryForm.get("category");
  }
}
