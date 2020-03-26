import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ProductService } from 'src/app/services/product.service';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-import-product',
  templateUrl: './import-product.component.html',
  styleUrls: ['./import-product.component.scss']
})
export class ImportProductComponent implements OnInit {

  uploadingFile: boolean = false;
  isSubmitLoading: boolean = false;
  excelFile: File;

  importForm: FormGroup;
  server_message: any = {};
  product: any = {};
  submitted: boolean = false;

  isAllDisplayDataChecked = false;
  isOperating = false;
  isIndeterminate = false;
  listOfDisplayData: any = [];
  listOfAllData: any = [];
  mapOfCheckedId: { [key: string]: boolean } = {};
  numberOfChecked = 0;
  checkedData: any[];
  checkedDataIndex: any[];

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private responseMessage: NzMessageService
  ) { }

  ngOnInit() {
    this.setForm();
  }

  currentPageDataChange($event): void {
    this.listOfDisplayData = $event;
    this.refreshStatus();
  }

  refreshStatus(): void {
    this.isAllDisplayDataChecked = this.listOfDisplayData
      .filter(item => !item.disabled)
      .every(item => this.mapOfCheckedId[item.id]);
    this.isIndeterminate =
      this.listOfDisplayData.filter(item => !item.disabled).some(item => this.mapOfCheckedId[item.id]) &&
      !this.isAllDisplayDataChecked;
    this.numberOfChecked = this.listOfAllData.filter(item => this.mapOfCheckedId[item.id]).length;
    this.checkedData = this.listOfAllData.filter(item => this.mapOfCheckedId[item.id]);
  }

  checkAll(value: boolean): void {
    this.listOfDisplayData.filter(item => !item.disabled).forEach(item => (this.mapOfCheckedId[item.id] = value));
    this.refreshStatus();
  }

  operateData(): void {
    this.isOperating = true;
    setTimeout(() => {
      this.listOfAllData.forEach(item => (this.mapOfCheckedId[item.id] = false));
      this.refreshStatus();
      this.isOperating = false;
    }, 1000);
  }

  beforeUploadFile(file: File) {
    this.uploadingFile = true;
    const formData = new FormData();
    formData.append('file', file[0]);
    this.productService.import(formData).subscribe(
      data => {
        let xlsx = data.data;
        let newArray = [];
        xlsx.forEach((element, index) => {
          if (index > 0) {
            let data = {
              "id": index,
              "category_id": element[0],
              "sub_category_id": element[1],
              "brand_id": element[2],
              "name": element[3],
              "slug": element[4],
              "description": element[5],
              "stock": element[6],
              "sale_price": element[7],
              "purchase_price": element[8],
              "discount_type": element[9],
              "discount": element[10],
              "tax_type": element[11],
              "tax": element[12],
              "is_featured": element[13],
              "status": element[14]
            }
            newArray.push(data);
          }
        });
        this.listOfAllData = newArray;
        this.uploadingFile = false;
      },
      error => {
        this.uploadingFile = false;
        this.responseMessage.info(error.error.message, { nzDuration: 2000 });
      }
    )
  }

  setForm() {
    this.importForm = this.fb.group({
      file: [null, [Validators.required]]
    });
  }

  submit() {
    if (this.checkedData.length == 0) {
      this.responseMessage.info("Please select rows to import data !", { nzDuration: 2000 });
      return;
    }

    if (this.checkedData.length > 100) {
      this.responseMessage.info("Please select only 100 rows to import data !", { nzDuration: 2000 });
      return;
    }
    this.submitted = true;
    this.isSubmitLoading = true;
    this.productService.importProductData({ "products": this.checkedData }).subscribe(
      data => this.handleResponse(data),
      error => this.handleError(error)
    );
  }

  handleResponse(data) {
    if (data.status == true) {
      this.isSubmitLoading = false;
      this.submitted = false;
      this.removeFromArray();
      this.responseMessage.success(data.data.message, { nzDuration: 2000 });
    } else {
      this.isSubmitLoading = false;
      this.submitted = false;
      this.responseMessage.error(data.data.message, { nzDuration: 2000 });
    }
  }

  handleError(error) {
    this.isSubmitLoading = false;
    this.submitted = false;
    if (error.error.message.name === "SequelizeDatabaseError") {
      this.responseMessage.error(error.error.message.message, { nzDuration: 2000 });
    } else {
      this.server_message = error.error.message.errors;
    }
  }

  removeFromArray() {
    for (var i of this.listOfAllData) {
      for (var j of this.checkedData) {
        if (i.id === j.id) {
          this.listOfDisplayData.splice(i, 1);
          this.checkedData.splice(j, 1);
        }
      }
    }
    this.mapOfCheckedId = {};
    this.refreshStatus();
  }
}
