import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { CouponService } from 'src/app/services/coupon.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd';
import { ValidateNoSpace, ValidateDecimal } from 'src/app/validations/custom.validators';

@Component({
  selector: 'app-discount-coupon',
  templateUrl: './discount-coupon.component.html',
  styleUrls: ['./discount-coupon.component.scss']
})
export class DiscountCouponComponent implements OnInit {

  discountOnSelect = [
    { "key": "all_product", "value": "All Product" },
    { "key": "product", "value": "Product" },
    { "key": "category", "value": "Category" },
    { "key": "sub_category", "value": "Sub Category" },
    { "key": "brand", "value": "Brand" }
  ];
  discountOnSelectIds: any = [];
  discountOnSelectTitle: String = "";

  pageIndex = 1;
  pageSize = 10;
  total = 1;
  listOfData: any = [];
  loading = true;
  sortValue: string | null = '';
  sortKey: string | null = '';
  CouponAddEditModal: boolean = false;
  CouponAddEditModalTitle = '';
  CouponAddEditModalButton = '';
  isSubmitLoading: boolean = false;

  couponForm: FormGroup;
  server_message: any = {};
  coupon: any = {};
  submitted: boolean = false;

  search: any = {};

  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    private couponService: CouponService,
    private responseMessage: NzMessageService
  ) { }

  ngOnInit() {
    this.setSearch();
    this.searchData();
    this.setValues();
    this.setForm();
  }

  sort(sort: { key: string; value: string }): void {
    this.sortKey = sort.key;
    this.sortValue = sort.value;
    this.searchData(true);
  }

  setSearch() {
    this.search.id = '';
    this.search.title = '';
    this.search.coupon_code = '';
    this.search.discount_on_type = '';
    this.search.valid_from = '';
    this.search.valid_to = '';
    this.search.discount_type = '';
    this.search.discount_value = '';
    this.search.status = '';
  }

  searchData(reset: boolean = false): void {
    if (reset) {
      this.pageIndex = 1;
    }
    this.loading = true;
    this.couponService
      .all(this.pageIndex, this.pageSize, this.sortKey!, this.sortValue!, this.search)
      .subscribe(data => {
        this.loading = false;
        this.total = data.data.count[0].count;
        this.listOfData = data.data.response;
      });
  }

  add() {
    this.CouponAddEditModal = true;
    this.CouponAddEditModalTitle = "New Coupon";
    this.CouponAddEditModalButton = "Insert";
    this.setForm();
    this.setValues();
    this.submitted = false;
  }

  edit(id) {
    this.couponService.single(id).subscribe(
      data => {
        this.coupon = data.data;
        this.CouponAddEditModal = true;
        this.CouponAddEditModalTitle = "Edit : " + this.coupon.name;
        this.CouponAddEditModalButton = "Update";
        this.setForm();
      }
    );
  }

  cancel() {
    this.CouponAddEditModal = false;
    this.isSubmitLoading = false;
    this.setForm();
    this.setValues();
  }

  submit() {
    this.submitted = true;
    if (!this.couponForm.valid) {
      return;
    }
    this.isSubmitLoading = true;
    if (this.coupon.id === undefined) {
      this.couponService.insert(this.coupon).subscribe(
        data => this.handleResponse(data),
        error => this.handleError(error)
      );
    } else {
      this.couponService.update(this.coupon).subscribe(
        data => this.handleResponse(data),
        error => this.handleError(error)
      );
    }
  }

  delete(id) {
    this.couponService.delete(id).subscribe(
      data => this.handleResponse(data),
      error => this.handleError(error)
    );
  }

  setValues() {
    this.coupon = {};
    this.coupon.title = '';
    this.coupon.coupon_code = '';
    this.coupon.valid_from = '';
    this.coupon.valid_to = '';
    this.coupon.discount_on_type = 'all_product';
    this.coupon.discount_on_id = [];
    this.coupon.discount_type = 'flat';
    this.coupon.discount_value = '';
    this.coupon.status = 'active';
  }

  setForm() {
    this.couponForm = this.fb.group({
      title: [this.coupon.title, [Validators.required, Validators.maxLength(255), Validators.minLength(2)]],
      coupon_code: [this.coupon.coupon_code, [Validators.required, Validators.maxLength(255), Validators.minLength(2), ValidateNoSpace]],
      valid_from: [this.coupon.valid_from, [Validators.required]],
      valid_to: [this.coupon.valid_to, [Validators.required]],
      discount_on_type: [this.coupon.discount_on_type, [Validators.required]],
      discount_on_id: [this.coupon.discount_on_id, []],
      discount_type: [this.coupon.discount_type, [Validators.required]],
      discount_value: [this.coupon.discount_value, [Validators.required, ValidateDecimal]],
      status: [this.coupon.status, [Validators.required]]
    });
  }

  handleResponse(data) {
    this.isSubmitLoading = false;
    this.submitted = false;
    if (data.status == true) {
      this.CouponAddEditModal = false;
      this.responseMessage.success(data.message, { nzDuration: 2000 });
      this.searchData();
    } else {
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

  getDiscountType() {
    this.discountOnSelectIds = [];
    this.coupon.discount_on_id = [];

    switch (this.coupon.discount_on_type) {
      case "product":
        this.discountOnSelectTitle = "Product";
        this.getProduct();
        break;

      case "category":
        this.discountOnSelectTitle = "Category";
        this.getCategory();
        break;

      case "sub_category":
        this.discountOnSelectTitle = "Sub Category";
        this.getSubCategory();
        break;

      case "brand":
        this.discountOnSelectTitle = "Brand";
        this.getBrand();
        break;

      default:
        break;
    }
  }

  getSubCategory() {
    this.commonService.dropdown('sub_category', { "total": this.discountOnSelectIds.length }).subscribe(
      data => {
        this.discountOnSelectIds = [...this.discountOnSelectIds, ...data.dropdown];
      }
    )
  }

  getCategory() {
    this.commonService.dropdown('category', { "total": this.discountOnSelectIds.length }).subscribe(
      data => {
        this.discountOnSelectIds = [...this.discountOnSelectIds, ...data.dropdown];
      }
    )
  }

  getBrand() {
    this.commonService.dropdown('brand', { "total": this.discountOnSelectIds.length }).subscribe(
      data => {
        this.discountOnSelectIds = [...this.discountOnSelectIds, ...data.dropdown];
      }
    )
  }

  getProduct() {
    this.commonService.dropdown('product', { "total": this.discountOnSelectIds.length }).subscribe(
      data => {
        this.discountOnSelectIds = [...this.discountOnSelectIds, ...data.dropdown];
      }
    )
  }

  convertDate(date){
    return date.split("T")[0];
  }

}
