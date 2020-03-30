import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { BundleService } from 'src/app/services/bundle.service';
import { NzMessageService } from 'ng-zorro-antd';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-bundle',
  templateUrl: './bundle.component.html',
  styleUrls: ['./bundle.component.scss']
})

export class BundleComponent implements OnInit {

  pageIndex = 1;
  pageSize = 10;
  total = 1;
  listOfData: any = [];
  loading = true;
  sortValue: string | null = null;
  sortKey: string | null = null;
  search: any = {};

  BundleAddEditModal: boolean = false;
  BundleAddEditModalTitle = 'Manage Bundles';
  BundleAddEditModalButton = '';
  isSubmitLoading: boolean = false;

  categories: any = [];
  sub_categories: any = [];
  brands: any = [];
  products: any = [];

  bundleForm: FormGroup;
  isValidControl: boolean = false;

  server_message: any = {};
  bundle: any = {};
  submitted: boolean = false;

  currentStepForm = 0;

  stock: any = {};
  stockErrors: any = {};
  StockEditModal: boolean = false;
  StockEditModalTitle: String = "";
  StockEditModalButton: String = "";
  isStockSubmitLoading: boolean = false;

  discount: any = {};
  discountErrors: any = {};
  DiscountEditModal: boolean = false;
  DiscountEditModalTitle: String = "";
  DiscountEditModalButton: String = "";
  isDiscountSubmitLoading: boolean = false;

  tax: any = {};
  taxErrors: any = {};
  TaxEditModal: boolean = false;
  TaxEditModalTitle: String = "";
  TaxEditModalButton: String = "";
  isTaxSubmitLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private bundleService: BundleService,
    private commonService: CommonService,
    private responseMessage: NzMessageService
  ) { }

  ngOnInit() {
    this.setSearch();
    this.searchData();
    this.setValues();
    this.setForm();
    this.getCategory();
    this.getBrands();
  }

  addControl() {
    this.bundle.products.push({
      "category_id": null,
      "sub_category_id": null,
      "brand_id": null,
      "product_id": null
    });

    const controls = this.bundleForm.controls.products as FormArray;
    controls.push(this.fb.group({
      category_id: null,
      sub_category_id: null,
      brand_id: null,
      product_id: null
    }));
  }

  removeControl(index) {
    if (this.bundle.products.length == 1) {
      return;
    }
    this.bundle.products.splice(index, 1);
    const controls = this.bundleForm.controls.products as FormArray;
    controls.removeAt(index);
  }

  checkControl() {
    this.bundle.products.forEach(element => {
      if (element.category_id == null || element.sub_category_id == null || element.brand_id == null || element.product_id == null) {
        this.isValidControl = false;
        return false;
      } else {
        this.isValidControl = true;
        return true;
      }
    });
  }

  stockM(id) {
    this.stock = {};
    this.stockErrors = {};
    this.StockEditModal = true;
    this.StockEditModalButton = "Update Stock";
    this.isStockSubmitLoading = false;

    var stock = this.listOfData.find(e => {
      return e.id == id;
    })

    this.StockEditModalTitle = "Edit Stock : " + stock.name;
    this.stock.id = stock.id;
    this.stock.stock = stock.stock;
  }

  cancelStock() {
    this.StockEditModal = false;
    this.StockEditModalTitle = "";
    this.StockEditModalButton = "";
    this.isStockSubmitLoading = false;
  }

  updateStock() {
    this.isStockSubmitLoading = true;
    this.bundleService.changeStock(this.stock).subscribe(
      data => {
        this.cancelStock();
        this.searchData();
        this.responseMessage.success(data.data.message, { nzDuration: 2000 });
      },
      error => {
        if (error.error.message.name === "SequelizeDatabaseError") {
          this.responseMessage.error(error.error.message.message, { nzDuration: 2000 });
        } else {
          this.stockErrors = error.error.message.errors;
          this.isStockSubmitLoading = false;
        }
      }
    )
  }

  discountM(id) {
    this.discount = {};
    this.discountErrors = {};
    this.DiscountEditModal = true;
    this.DiscountEditModalButton = "Update Discount";
    this.isDiscountSubmitLoading = false;

    var discount = this.listOfData.find(e => {
      return e.id == id;
    })

    this.DiscountEditModalTitle = "Edit Discount : " + discount.name;
    this.discount.id = discount.id;
    this.discount.discount_type = discount.discount_type;
    this.discount.discount = discount.discount;
  }

  cancelDiscount() {
    this.DiscountEditModal = false;
    this.DiscountEditModalTitle = "";
    this.DiscountEditModalButton = "";
    this.isDiscountSubmitLoading = false;
  }

  updateDiscount() {
    this.isDiscountSubmitLoading = true;
    this.bundleService.changeDiscount(this.discount).subscribe(
      data => {
        this.cancelDiscount();
        this.searchData();
        this.responseMessage.success(data.data.message, { nzDuration: 2000 });
      },
      error => {
        if (error.error.message.name === "SequelizeDatabaseError") {
          this.responseMessage.error(error.error.message.message, { nzDuration: 2000 });
        } else {
          this.discountErrors = error.error.message.errors;
          this.isDiscountSubmitLoading = false;
        }
      }
    )
  }

  taxM(id) {
    this.tax = {};
    this.taxErrors = {};
    this.TaxEditModal = true;
    this.TaxEditModalButton = "Update Tax";
    this.isTaxSubmitLoading = false;
    var tax = this.listOfData.find(e => {
      return e.id == id;
    })

    this.TaxEditModalTitle = "Edit Tax : " + tax.name;
    this.tax.id = tax.id;
    this.tax.tax_type = tax.tax_type;
    this.tax.tax = tax.tax;
  }

  cancelTax() {
    this.TaxEditModal = false;
    this.TaxEditModalTitle = "";
    this.TaxEditModalButton = "";
    this.isTaxSubmitLoading = false;
  }

  updateTax() {
    this.isTaxSubmitLoading = true;
    this.bundleService.changeTax(this.tax).subscribe(
      data => {
        this.cancelTax();
        this.searchData();
        this.responseMessage.success(data.data.message, { nzDuration: 2000 });
      },
      error => {
        if (error.error.message.name === "SequelizeDatabaseError") {
          this.responseMessage.error(error.error.message.message, { nzDuration: 2000 });
        } else {
          this.taxErrors = error.error.message.errors;
          this.isTaxSubmitLoading = false;
        }
      }
    )
  }

  onChangeNumber(value: string, type): void {
    const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
    if ((!isNaN(+value) && reg.test(value))) {
      var value = value;
      this.bundle[type] = value;
    } else {
      this.bundle[type] = null;
      return;
    }
  }

  pre(): void {
    this.currentStepForm -= 1;
  }

  next(): void {
    this.currentStepForm += 1;
  }

  sort(sort: { key: string; value: string }): void {
    this.sortKey = sort.key;
    this.sortValue = sort.value;
    this.searchData(true);
  }

  setSearch() {
    this.search.id = null;
    this.search.name = null;
    this.search.featured = null;
    this.search.status = null;
  }

  searchData(reset: boolean = false): void {
    if (reset) {
      this.pageIndex = 1;
    }
    this.loading = true;
    this.bundleService
      .all(this.pageIndex, this.pageSize, this.sortKey!, this.sortValue!, this.search)
      .subscribe(
        data => {
          this.loading = false;
          this.total = data.data.count[0].count;
          this.listOfData = data.data.response;
        });
  }

  add() {
    this.BundleAddEditModal = true;
    this.BundleAddEditModalTitle = "New Bundle";
    this.BundleAddEditModalButton = "Add Bundle";
    this.submitted = false;
    this.isSubmitLoading = false;
    this.currentStepForm = 0;
    this.setForm();
    this.setValues();
  }

  edit(id) {
    this.bundleService.single(id).subscribe(
      data => {
        this.bundle = data.data;
        this.bundle.category_id = this.bundle.category_id.toString();
        this.bundle.sub_category_id = this.bundle.sub_category_id.toString();
        this.bundle.brand_id = this.bundle.brand_id.toString();
        this.BundleAddEditModal = true;
        this.BundleAddEditModalTitle = "Edit : " + this.bundle.name;
        this.BundleAddEditModalButton = "Update";
        this.setForm();
        this.currentStepForm = 0;
      }
    )
  }

  delete(id) {
    this.bundleService.delete(id).subscribe(
      data => this.handleResponse(data),
      error => this.handleError(error)
    );
  }

  changeFeatured(id, value) {
    const data = { "id": id, "featured": value };
    this.bundleService.changeFeatured(data).subscribe(
      data => {
        this.responseMessage.success(data.data.message, { nzDuration: 2000 });
      },
      error => {
        if (error.error.message.name === "SequelizeDatabaseError") {
          this.responseMessage.error(error.error.message.message, { nzDuration: 2000 });
        }
      }
    )
  }

  changeStatus(id, value) {
    const data = { "id": id, "status": value };
    this.bundleService.changeStatus(data).subscribe(
      data => {
        this.responseMessage.success(data.data.message, { nzDuration: 2000 });
      }
    )
  }

  cancel() {
    this.BundleAddEditModal = false;
    this.BundleAddEditModalTitle = 'Manage Bundles';
    this.isSubmitLoading = false;
    this.setForm();
    this.setValues();
  }


  getCategory() {
    this.commonService.dropdown('category', '').subscribe(
      data => {
        this.categories = data.dropdown;
      }
    )
  }

  getSubCategory() {
    if (this.bundle.category_id == null) {
      return;
    }
    this.commonService.dropdown('sub_category', 'category_id=' + this.bundle.category_id).subscribe(
      data => {
        this.sub_categories = data.dropdown;
      }
    )
  }

  getBrands() {
    this.commonService.dropdown('brand', '').subscribe(
      data => {
        this.brands = data.dropdown;
      }
    )
  }

  getProducts() {
    if (this.bundle.category_id == null || this.bundle.sub_category_id == null || this.bundle.brand_id == null) {
      return;
    }
    this.commonService.dropdown('product', '').subscribe(
      data => {
        this.products = data.dropdown;
      }
    )
  }

  setValues() {
    this.bundle = {};
    this.bundle.products = [{
      "category_id": null,
      "sub_category_id": null,
      "brand_id": null,
      "product_id": null
    }];
    this.bundle.name = null;
    this.bundle.slug = null;
    this.bundle.status = 'active';
    this.bundle.sale_price = null;
    this.bundle.purchase_price = null;
    this.bundle.is_featured = 'no';
    this.bundle.discount_type = 'flat';
    this.bundle.discount = null;
    this.bundle.tax_type = 'flat';
    this.bundle.tax = null;
    this.bundle.description = null;
    this.bundle.stock = null;
  }

  setForm() {
    this.bundleForm = this.fb.group({
      products: this.fb.array([this.fb.group({
		  category_id: null,
		  sub_category_id: null,
		  brand_id: null,
		  product_id: null
	  })]),
      name: [this.bundle.name, [Validators.required]],
      slug: [this.bundle.slug, [Validators.required]],
      sale_price: [this.bundle.sale_price, [Validators.required]],
      purchase_price: [this.bundle.purchase_price, [Validators.required]],
      is_featured: [this.bundle.is_featured, [Validators.required]],
      discount_type: [this.bundle.discount_type, [Validators.required]],
      discount: [this.bundle.discount, [Validators.required]],
      tax_type: [this.bundle.tax_type, [Validators.required]],
      tax: [this.bundle.tax, [Validators.required]],
      description: [this.bundle.description, [Validators.required]],
      stock: [this.bundle.stock, [Validators.required]],
      status: [this.bundle.status, [Validators.required]]
    });
  }

  submit() {
    this.isSubmitLoading = true;
    this.submitted = true;
    console.log(this.bundle);
    return;
    if (this.bundleForm.valid) {
      if (this.bundle.id === undefined) {
        this.bundleService.insert(this.bundle).subscribe(
          data => this.handleResponse(data),
          error => this.handleError(error)
        )
      } else {
        this.bundleService.update(this.bundle).subscribe(
          data => this.handleResponse(data),
          error => this.handleError(error)
        )
      }
    }
  }

  handleResponse(data) {
    if (data.status == true) {
      this.BundleAddEditModal = false;
      this.BundleAddEditModalTitle = 'Manage Bundles';
      this.isSubmitLoading = false;
      this.responseMessage.success(data.message, { nzDuration: 2000 });
      this.searchData();
    } else {
      this.isSubmitLoading = false;
      this.responseMessage.error(data.message, { nzDuration: 2000 });
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

  convertToSlug() {
    if (this.bundle.name == null) {
      return;
    }
    if (this.bundle.id == undefined) {
      let slug = this.bundle.name
        .toLowerCase()
        .replace(/[^\w ]+/g, '')
        .replace(/ +/g, '-')
        ;
      this.bundle.slug = slug;
    }
  }

}
