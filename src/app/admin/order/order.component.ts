import { Component, OnInit } from '@angular/core';
import { TokenService } from 'src/app/services/token.service';
import { OrderService } from 'src/app/services/order.service';
import { NzMessageService } from 'ng-zorro-antd';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {
  pageIndex = 1;
  pageSize = 10;
  total = 1;
  listOfData: any = [];
  loading = true;
  sortValue: string | null = '';
  sortKey: string | null = '';

  server_message: any = {};


  search: any = {};

  sessionRole: String = "";

  orderForm: FormGroup;
  order: any = {};
  submitted: boolean = false;

  OrderAddEditModal: boolean = false;
  OrderAddEditModalTitle = 'Manage Orders';
  OrderAddEditModalButton = '';
  isSubmitLoading = false;
  constructor(
    private fb: FormBuilder,
    private tokenService: TokenService,
    private orderService: OrderService,
    private responseMessage: NzMessageService
  ) { }

  ngOnInit() {
    this.sessionRole = this.tokenService.getUser().role;
    this.setSearch();
    this.searchData();
    this.setForm();
  }

  sort(sort: { key: string; value: string }): void {
    this.sortKey = sort.key;
    this.sortValue = sort.value;
    this.searchData(true);
  }

  setSearch() {
    this.search.id = '';
    this.search.vendorname = '';
    this.search.username = '';
    this.search.product = '';
    this.search.quantity = '';
    this.search.price = '';
    this.search.coupon = '';
    this.search.date = '';
    this.search.status = '';
  }

  searchData(reset: boolean = false): void {
    if (reset) {
      this.pageIndex = 1;
    }
    this.loading = true;
    this.orderService
      .all(this.pageIndex, this.pageSize, this.sortKey!, this.sortValue!, this.search)
      .subscribe(data => {
        this.loading = false;
        this.total = data.data.count[0].count;
        this.listOfData = data.data.response;
      });
  }

  edit(id) {
    this.orderService.single(id).subscribe(
      data => {
        this.order = data.data;
        this.OrderAddEditModal = true;
        this.OrderAddEditModalTitle = "Edit : " + this.order.id;
        this.OrderAddEditModalButton = "Update";
        this.setForm();
      }
    )
  }

  cancel() {
    this.OrderAddEditModal = false;
    this.OrderAddEditModalTitle = 'Manage Orders';
    this.setForm();
  }
  
  setForm() {
    this.orderForm = this.fb.group({
      status: [this.order.status, [Validators.required]]
    });
  }

  submit() {
    this.isSubmitLoading = true;
    this.orderService.update(this.order).subscribe(
      data => this.handleResponse(data),
      error => this.handleError(error)
    );
  }

  delete(id) {    
   
  }

  handleResponse(data) {
    this.isSubmitLoading = false;
    if (data.status == true) {
      this.OrderAddEditModal = false;
      this.responseMessage.success(data.message, { nzDuration: 2000 });
      this.searchData();
    } else {
      this.responseMessage.error(data.message, { nzDuration: 2000 });
    }
  }

  handleError(error) {
    this.isSubmitLoading = false;
    if (error.error.message.name === "SequelizeDatabaseError") {
      this.responseMessage.error(error.error.message.message, { nzDuration: 2000 });
    } else {
      this.server_message = error.error.message.errors;
    }
  }

}
