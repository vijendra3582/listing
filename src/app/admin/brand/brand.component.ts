import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BrandService } from 'src/app/services/brand.service';
import { NzMessageService } from 'ng-zorro-antd';
import { ValidateSlug } from 'src/app/validations/custom.validators';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-brand',
  templateUrl: './brand.component.html',
  styleUrls: ['./brand.component.scss']
})
export class BrandComponent implements OnInit {

  pageIndex = 1;
  pageSize = 10;
  total = 1;
  listOfData: any = [];
  loading = true;
  sortValue: string | null = '';
  sortKey: string | null = '';
  BrandAddEditModal: boolean = false;
  BrandAddEditModalTitle = '';
  BrandAddEditModalButton = '';
  isSubmitLoading: boolean = false;

  brandForm: FormGroup;
  server_message: any = {};
  brand: any = {};
  submitted: boolean = false;

  search: any = {};

  sessionRole: String = "";

  constructor(
    private fb: FormBuilder,
    private tokenService: TokenService,
    private brandService: BrandService,
    private responseMessage: NzMessageService
  ) { }

  ngOnInit() {
    this.sessionRole = this.tokenService.getUser().role;
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
    this.search.name = '';
    this.search.slug = '';
    this.search.status = '';
  }

  searchData(reset: boolean = false): void {
    if (reset) {
      this.pageIndex = 1;
    }
    this.loading = true;
    this.brandService
      .all(this.pageIndex, this.pageSize, this.sortKey!, this.sortValue!, this.search)
      .subscribe(data => {
        this.loading = false;
        this.total = data.data.count[0].count;
        this.listOfData = data.data.response;
      });
  }

  add() {
    this.BrandAddEditModal = true;
    this.BrandAddEditModalTitle = "New Brand";
    this.BrandAddEditModalButton = "Insert";
    this.setForm();
    this.setValues();
    this.submitted = false;
  }

  edit(id) {
    this.brandService.single(id).subscribe(
      data => {
        this.brand = data.data;
        this.BrandAddEditModal = true;
        this.BrandAddEditModalTitle = "Edit : " + this.brand.name;
        this.BrandAddEditModalButton = "Update";
        this.setForm();
      }
    );
  }

  cancel() {
    this.BrandAddEditModal = false;
    this.isSubmitLoading = false;
    this.setForm();
    this.setValues();
  }

  submit() {
    if (this.sessionRole == "vendor") {
      return;
    }

    this.submitted = true;
    if (!this.brandForm.valid) {
      return;
    }
    this.isSubmitLoading = true;
    if (this.brand.id === undefined) {
      this.brandService.insert(this.brand).subscribe(
        data => this.handleResponse(data),
        error => this.handleError(error)
      );
    } else {
      this.brandService.update(this.brand).subscribe(
        data => this.handleResponse(data),
        error => this.handleError(error)
      );
    }
  }

  delete(id) {
    if (this.sessionRole == "vendor") {
      return;
    }
    
    this.brandService.delete(id).subscribe(
      data => this.handleResponse(data),
      error => this.handleError(error)
    );
  }

  setValues() {
    this.brand = {};
    this.brand.name = '';
    this.brand.slug = '';
    this.brand.status = 'active';
  }

  setForm() {
    this.brandForm = this.fb.group({
      name: [this.brand.name, [Validators.required, Validators.maxLength(255), Validators.minLength(2)]],
      slug: [this.brand.slug, [Validators.required, Validators.maxLength(255), Validators.minLength(2), ValidateSlug]],
      status: [this.brand.status, [Validators.required]]
    });
  }

  handleResponse(data) {
    this.isSubmitLoading = false;
    this.submitted = false;
    if (data.status == true) {
      this.BrandAddEditModal = false;
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

  convertToSlug() {
    if (this.brand.name == null) {
      return;
    }
    if (this.brand.id == undefined) {
      let slug = this.brand.name
        .toLowerCase()
        .replace(/[^\w ]+/g, '')
        .replace(/ +/g, '-')
        ;
      this.brand.slug = slug;
    }
  }

}
