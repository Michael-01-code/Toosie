import { InventoryService } from "src/app/core/service/inventory/inventory.service";
import { Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup } from "@angular/forms";
import { BannerService } from "src/app/core/service/banner/banner.service";

@Component({
  selector: "app-media",
  templateUrl: "./media.component.html",
  styleUrls: ["./media.component.scss"],
})
export class MediaComponent implements OnInit {
  public media = [];
  files: File[] = [];
  productForm: FormGroup;
  loading = false;
  constructor(private fb: FormBuilder, private bannerS: BannerService) {
    // this.media = mediaDB.data;
    this.productForm = this.fb.group({
      current: false,
      banners: this.fb.array([]),
    });
  }
  ngOnInit() {
    this.loadBanner()
  }
  public settings = {
    actions: {
      edit: true,
      add: false,
      position: 'right'
  },
    delete: {
      confirmDelete: true,

      deleteButtonContent: 'Delete data',
      saveButtonContent: 'save',
      cancelButtonContent: 'cancel'
    },
    edit: {
      editButtonContent: `'<i class="fas fa-pencil-alt fa-fw"></i>'`,
      saveButtonContent: '<i class="fas fa-check fa-fw"></i>',
      cancelButtonContent: '<i class="fas fa-times fa-fw"></i>',
      confirmSave: true
    },
    columns: {
      banners: {
        title: 'Image',
        type: 'html',
      },
      title: {
        title: 'Name',
        type: 'html',
      },
      current: {
        title: 'Current Banner',
      },
    },
  };
  loadBanner(){
    this.bannerS.BannerStore.subscribe((e:any) =>{
      console.log(e)
      this.media = e.map(e =>{
        return {
          ...e,
          current: e.current === true ? "Yes" : "No",
          title: e.textContent.map(b => `<p> ${b.header}</p>`).join(""),
          banners: e.banners.map(b => `<img src=${b} class='imgTable'>`)
        }
      })
    })
  }
  banners(): FormArray {
    return this.productForm.get("banners") as FormArray;
  }

  newBanner(): FormGroup {
    return this.fb.group({
      header: "",
      subText: "",
    });
  }

  addBanner() {
    this.banners().push(this.newBanner());
  }

  removeBanner(i: number) {
    this.banners().removeAt(i);
    this.files.splice(i, 1);
  }



  onSelect(event) {
    console.log(event);
    this.files.push(...event.addedFiles);
    for (let index = 0; index < event.addedFiles.length; index++) {
      this.addBanner();
    }
  }

  onRemove(event) {
    console.log(event, this.files.indexOf(event));
    let index = this.files.indexOf(event);
    this.files.splice(index, 1);
    this.removeBanner(index);
  }
  onSubmit() {
    this.loading = true;
    var data = new FormData();
    for (let i = 0; i < this.files.length; i++) {
      data.append("upload", this.files[i], this.files[i].name);
    }
    this.bannerS.uploadMedia(data).subscribe((inv) => {
      const obj = {
        ...this.productForm.value,
        banners: inv.images,
        textContent: this.productForm.get("banners").value,
      };
      console.log(this.productForm.get("banners"))
      console.log(obj)
      this.bannerS.createBanner(obj).subscribe((res) => {
        console.log(res);
        this.loading = false;
        this.files = [];
        this.productForm.reset();
      });
    });
  }
}
