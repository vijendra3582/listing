import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { CommonService } from 'src/app/services/common.service';
import { LocationService } from 'src/app/services/location.service';
import { NzMessageService } from 'ng-zorro-antd';
import { ValidateNumber } from 'src/app/validations/custom.validators';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  pageIndex = 1;
  pageSize = 10;
  total = 1;
  listOfData: any = [];
  loading = true;
  sortValue: string | null = null;
  sortKey: string | null = null;
  UserAddEditModal: boolean = false;
  UserAddEditModalTitle = '';
  UserAddEditModalButton = '';
  isSubmitLoading: boolean = false;

  userForm: FormGroup;
  server_message: any = {};
  user: any = {};
  submitted: boolean = false;

  search: any = {};

  states: any = [];
  cities: any = [];

  citiesGST: any = [];

  currentStepForm = 0;

  uploading: boolean = false;
  uploadingSign: boolean = false;

  constructor(
    private fb: FormBuilder,
    private locationService: LocationService,
    private userService: UserService,
    private responseMessage: NzMessageService
  ) { }

  ngOnInit() {
    this.setSearch();
    this.searchData();
    this.setValues();
    this.setForm();
    this.getState();
  }

  sort(sort: { key: string; value: string }): void {
    this.sortKey = sort.key;
    this.sortValue = sort.value;
    this.searchData(true);
  }

  setSearch() {
    this.search.id = null;
    this.search.name = null;
    this.search.email = null;
    this.search.mobile = null;
    this.search.status = null;
  }

  searchData(reset: boolean = false): void {
    if (reset) {
      this.pageIndex = 1;
    }
    this.loading = true;
    this.userService
      .all(this.pageIndex, this.pageSize, this.sortKey!, this.sortValue!, this.search)
      .subscribe(data => {
        this.loading = false;
        this.total = data.data.count[0].count;
        this.listOfData = data.data.response;
      });
  }

  add() {
    this.UserAddEditModal = true;
    this.UserAddEditModalTitle = "New User";
    this.UserAddEditModalButton = "Insert";
    this.setForm();
    this.setValues();
    this.submitted = false;
  }

  edit(id) {
    this.userService.single(id).subscribe(
      data => {
        this.user = data.data;
        this.UserAddEditModal = true;
        this.UserAddEditModalTitle = "Edit : " + this.user.name;
        this.UserAddEditModalButton = "Update";
        this.setForm();
        this.currentStepForm = 0;
      }
    );
  }

  cancel() {
    this.UserAddEditModal = false;
    this.isSubmitLoading = false;
    this.setForm();
    this.setValues();
  }

  submit() {
    this.submitted = true;
    this.isSubmitLoading = true;
    if (this.user.id === undefined) {
      this.userService.insert(this.user).subscribe(
        data => this.handleResponse(data),
        error => this.handleError(error)
      );
    } else {
      this.userService.update(this.user).subscribe(
        data => this.handleResponse(data),
        error => this.handleError(error)
      );
    }
  }

  delete(id) {
    this.userService.delete(id).subscribe(
      data => this.handleResponse(data),
      error => this.handleError(error)
    );
  }

  getState() {
    let country_id = this.user.country;
    if (!country_id) {
      return;
    }
    this.locationService.getState(country_id).subscribe(result => {
      this.states = result;
    });
  }

  getCity(type) {
    let state_id = this.user.state;
    if (!state_id) {
      return;
    }
    this.locationService.getCity(state_id).subscribe(result => {
      if (type == 'state') {
        this.cities = result;
      } else if (type == 'gst') {
        this.citiesGST = result;
      }
    });
  }

  setValues() {
    this.user = {};
    this.user.email = null;
    this.user.password = null;
    this.user.name = null;
    this.user.mobile = null;
    this.user.address = null;
    this.user.city = null;
    this.user.state = null;
    this.user.country = 101;
    this.user.profession = null;
    this.user.status = 'active';
  }

  setForm() {
    this.userForm = this.fb.group({
      email: [this.user.email, [Validators.email, Validators.required, Validators.maxLength(255), Validators.minLength(2)]],
      password: [this.user.password, [Validators.required, Validators.minLength(8)]],
      name: [this.user.name, [Validators.required, Validators.maxLength(255), Validators.minLength(2)]],
      mobile: [this.user.mobile, [Validators.required, Validators.minLength(10), Validators.maxLength(10), ValidateNumber]],
      address: [this.user.address, [Validators.required, Validators.maxLength(255), Validators.minLength(2)]],
      city: [this.user.city, [Validators.required]],
      state: [this.user.state, [Validators.required]],
      profession: [this.user.profession, [Validators.required]],
      status: [this.user.status, [Validators.required]],
    });
  }

  handleResponse(data) {
    this.isSubmitLoading = false;
    this.submitted = false;
    if (data.status == true) {
      this.UserAddEditModal = false;
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
}
