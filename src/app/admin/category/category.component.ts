import { Component, OnInit } from '@angular/core';
import { CategoryService } from 'src/app/services/category.service';
import { NzMessageService } from 'ng-zorro-antd';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ValidateSlug } from 'src/app/validations/custom.validators';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  pageIndex = 1;
  pageSize = 10;
  total = 1;
  listOfData: any = [];
  loading = true;
  sortValue: string | null = null;
  sortKey: string | null = null;
  CategoryAddEditModal: boolean = false;
  CategoryAddEditModalTitle = '';
  CategoryAddEditModalButton = '';
  isSubmitLoading: boolean = false;

  categoryForm: FormGroup;
  server_message: any = {};
  category: any = {};
  submitted: boolean = false;

  search: any = {};

  sessionRole: String = "";

  constructor(
    private fb: FormBuilder,
    private tokenService: TokenService,
    private categoryService: CategoryService,
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
    this.search.id = null;
    this.search.name = null;
    this.search.slug = null;
    this.search.status = null;
  }

  searchData(reset: boolean = false): void {
    if (reset) {
      this.pageIndex = 1;
    }
    this.loading = true;
    this.categoryService
      .all(this.pageIndex, this.pageSize, this.sortKey!, this.sortValue!, this.search)
      .subscribe(data => {
        this.loading = false;
        this.total = data.data.count[0].count;
        this.listOfData = data.data.response;
      });
  }

  add() {
    this.CategoryAddEditModal = true;
    this.CategoryAddEditModalTitle = "New Category";
    this.CategoryAddEditModalButton = "Insert";
    this.setForm();
    this.setValues();
    this.submitted = false;
  }

  edit(id) {
    this.categoryService.single(id).subscribe(
      data => {
        this.category = data.data;
        this.CategoryAddEditModal = true;
        this.CategoryAddEditModalTitle = "Edit : " + this.category.name;
        this.CategoryAddEditModalButton = "Update";
        this.setForm();
      }
    );
  }

  cancel() {
    this.CategoryAddEditModal = false;
    this.isSubmitLoading = false;
    this.setForm();
    this.setValues();
  }

  submit() {
    if (this.sessionRole == "vendor") {
      return;
    }

    this.submitted = true;
    if (!this.categoryForm.valid) {
      return;
    }
    this.isSubmitLoading = true;
    if (this.category.id === undefined) {
      this.categoryService.insert(this.category).subscribe(
        data => this.handleResponse(data),
        error => this.handleError(error)
      );
    } else {
      this.categoryService.update(this.category).subscribe(
        data => this.handleResponse(data),
        error => this.handleError(error)
      );
    }
  }

  delete(id) {
    if (this.sessionRole == "vendor") {
      return;
    }
    
    this.categoryService.delete(id).subscribe(
      data => this.handleResponse(data),
      error => this.handleError(error)
    );
  }

  setValues() {
    this.category = {};
    this.category.name = '';
    this.category.slug = '';
    this.category.status = 'active';
  }

  setForm() {
    this.categoryForm = this.fb.group({
      name: [this.category.name, [Validators.required, Validators.maxLength(255), Validators.minLength(2)]],
      slug: [this.category.slug, [Validators.required, Validators.maxLength(255), Validators.minLength(2), ValidateSlug]],
      status: [this.category.status, [Validators.required]]
    });
  }

  handleResponse(data) {
    this.isSubmitLoading = false;
    this.submitted = false;
    if (data.status == true) {
      this.CategoryAddEditModal = false;
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
    if (this.category.name == null) {
      return;
    }
    if (this.category.id == undefined) {
      let slug = this.category.name
        .toLowerCase()
        .replace(/[^\w ]+/g, '')
        .replace(/ +/g, '-')
        ;
      this.category.slug = slug;
    }
  }
}
