import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd';
import { SubCategoryService } from 'src/app/services/sub-category.service';
import { CategoryService } from 'src/app/services/category.service';
import { CommonService } from 'src/app/services/common.service';
import { ValidateSlug } from 'src/app/validations/custom.validators';

@Component({
  selector: 'app-sub-category',
  templateUrl: './sub-category.component.html',
  styleUrls: ['./sub-category.component.scss']
})
export class SubCategoryComponent implements OnInit {

  categories: any = [];
  listOfDisplayData: any = [];
  pageIndex = 1;
  pageSize = 10;
  total = 1;
  listOfData: any = [];
  loading = true;
  sortValue: string | null = null;
  sortKey: string | null = null;
  SubCategoryAddEditModal: boolean = false;
  SubCategoryAddEditModalTitle = '';
  SubCategoryAddEditModalButton = '';
  isSubmitLoading: boolean = false;

  categoryForm: FormGroup;
  server_message: any = {};
  subCategory: any = {};
  mainCategory: any = [];
  submitted: boolean = false;

  search: any = {};

  constructor(
    private fb: FormBuilder,
    private subCategoryService: SubCategoryService,
    private commonService: CommonService,
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
    this.search.id = null;
    this.search.category = null;
    this.search.name = null;
    this.search.slug = null;
    this.search.status = null;
  }

  searchData(reset: boolean = false): void {
    if (reset) {
      this.pageIndex = 1;
    }
    this.loading = true;
    this.subCategoryService
      .all(this.pageIndex, this.pageSize, this.sortKey!, this.sortValue!, this.search)
      .subscribe(data => {
        this.loading = false;
        this.total = data.data.count[0].count;
        this.listOfData = data.data.response;
      });
  }

  add() {
    this.SubCategoryAddEditModal = true;
    this.SubCategoryAddEditModalTitle = "New Sub Category";
    this.SubCategoryAddEditModalButton = "Insert";
    this.setForm();
    this.setValues();
    this.getMainCategory();
    this.submitted = false;
  }

  edit(id) {
    this.subCategoryService.single(id).subscribe(
      data => {
        this.getMainCategory();
        this.subCategory = data.data;
        this.subCategory.category_id = this.subCategory.category_id.toString();
        this.SubCategoryAddEditModal = true;
        this.SubCategoryAddEditModalTitle = "Edit : " + this.subCategory.name;
        this.SubCategoryAddEditModalButton = "Update";
        this.setForm();
      }
    );
  }

  getMainCategory() {
    this.commonService.dropdown('category', { "total": this.categories.length }).subscribe(
      data => {
        this.mainCategory = [...this.mainCategory, ...data.dropdown];
      }
    )
  }

  cancel() {
    this.SubCategoryAddEditModal = false;
    this.isSubmitLoading = false;
    this.setForm();
    this.setValues();
  }

  submit() {
    this.submitted = true;
    if (!this.categoryForm.valid) {
      return;
    }

    this.isSubmitLoading = true;
    if (this.subCategory.id === undefined) {
      this.subCategoryService.insert(this.subCategory).subscribe(
        data => this.handleResponse(data),
        error => this.handleError(error)
      );
    } else {
      this.subCategoryService.update(this.subCategory).subscribe(
        data => this.handleResponse(data),
        error => this.handleError(error)
      );
    }
  }

  delete(id) {
    this.subCategoryService.delete(id).subscribe(
      data => this.handleResponse(data),
      error => this.handleError(error)
    );
  }

  setValues() {
    this.subCategory = {};
    this.subCategory.name = null;
    this.subCategory.slug = null;
    this.subCategory.category_id = null;
    this.subCategory.status = 'active';
  }

  setForm() {
    this.categoryForm = this.fb.group({
      name: [this.subCategory.name, [Validators.required, Validators.maxLength(255), Validators.minLength(2)]],
      slug: [this.subCategory.slug, [Validators.required, Validators.maxLength(255), Validators.minLength(2), ValidateSlug]],
      category_id: [this.subCategory.category_id, [Validators.required]],
      status: [this.subCategory.status, [Validators.required]]
    });
  }

  handleResponse(data) {
    if (data.status == true) {
      this.SubCategoryAddEditModal = false;
      this.isSubmitLoading = false;

      this.responseMessage.success(data.message, { nzDuration: 2000 });
      this.searchData();
    } else {
      this.isSubmitLoading = false;
      this.responseMessage.error(data.message, { nzDuration: 2000 });
    }
  }

  handleError(error) {
    if (error.error.message.name === "SequelizeDatabaseError") {
      this.responseMessage.error(error.error.message.message, { nzDuration: 2000 });
    } else {
      this.server_message = error.error.message.errors;
    }
  }

  convertToSlug() {
    if (this.subCategory.name == null) {
      return;
    }
    if (this.subCategory.id == undefined) {
      let slug = this.subCategory.name
        .toLowerCase()
        .replace(/[^\w ]+/g, '')
        .replace(/ +/g, '-')
        ;
      this.subCategory.slug = slug;
    }
  }

}
