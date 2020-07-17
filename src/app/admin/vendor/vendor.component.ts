import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { VendorService } from 'src/app/services/vendor.service';
import { NzMessageService } from 'ng-zorro-antd';
import { CommonService } from 'src/app/services/common.service';
import { LocationService } from 'src/app/services/location.service';
import { ValidateNumber } from 'src/app/validations/custom.validators';

@Component({
  selector: 'app-vendor',
  templateUrl: './vendor.component.html',
  styleUrls: ['./vendor.component.scss']
})
export class VendorComponent implements OnInit {

  pageIndex = 1;
  pageSize = 10;
  total = 1;
  listOfData: any = [];
  loading = true;
  sortValue: string | null = '';
  sortKey: string | null = '';
  VendorAddEditModal: boolean = false;
  VendorAddEditModalTitle = '';
  VendorAddEditModalButton = '';
  isSubmitLoading: boolean = false;

  vendorForm: FormGroup;
  server_message: any = {};
  vendor: any = {};
  submitted: boolean = false;

  search: any = {};

  states: any = [];
  cities: any = [];

  citiesGST: any = [];

  currentStepForm = 0;

  uploading: boolean = false;
  uploadingSign: boolean = false;

  uploadingLogo = false;
  fileListLogo: any = [];

  constructor(
    private fb: FormBuilder,
    private locationService: LocationService,
    private commonService: CommonService,
    private vendorService: VendorService,
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
    this.search.id = '';
    this.search.name = '';
    this.search.email = '';
    this.search.mobile = '';
    this.search.status = '';
  }

  searchData(reset: boolean = false): void {
    if (reset) {
      this.pageIndex = 1;
    }
    this.loading = true;
    this.vendorService
      .all(this.pageIndex, this.pageSize, this.sortKey!, this.sortValue!, this.search)
      .subscribe(data => {
        this.loading = false;
        this.total = data.data.count[0].count;
        this.listOfData = data.data.response;
      });
  }

  add() {
    this.VendorAddEditModal = true;
    this.VendorAddEditModalTitle = "New Vendor";
    this.VendorAddEditModalButton = "Insert";
    this.fileListLogo = [];
    this.setForm();
    this.setValues();
    this.submitted = false;
    this.currentStepForm = 0;
  }

  edit(id) {
    this.vendorService.single(id).subscribe(
      data => {
        this.vendor = data.data;
        this.fileListLogo = JSON.parse(this.vendor.logo);
        this.vendor.gst_add_proof_file = JSON.parse(this.vendor.gst_add_proof_file);
        this.vendor.gst_add_proof_sign = JSON.parse(this.vendor.gst_add_proof_sign);
        this.VendorAddEditModal = true;
        this.VendorAddEditModalTitle = "Edit : " + this.vendor.name;
        this.VendorAddEditModalButton = "Update";
        this.setForm();
        this.currentStepForm = 0;
      }
    );
  }

  cancel() {
    this.VendorAddEditModal = false;
    this.isSubmitLoading = false;
    this.setForm();
    this.setValues();
  }

  submit() {
    this.submitted = true;
    this.isSubmitLoading = true;
    this.vendor.logo = this.fileListLogo;
    if (this.vendor.id === undefined) {
      this.vendorService.insert(this.vendor).subscribe(
        data => this.handleResponse(data),
        error => this.handleError(error)
      );
    } else {
      this.vendorService.update(this.vendor).subscribe(
        data => this.handleResponse(data),
        error => this.handleError(error)
      );
    }
  }

  delete(id) {
    this.vendorService.delete(id).subscribe(
      data => this.handleResponse(data),
      error => this.handleError(error)
    );
  }

  pre(): void {
    this.currentStepForm -= 1;
  }

  next(): void {
    this.currentStepForm += 1;
  }

  getState() {
    let country_id = this.vendor.country;
    if (!country_id) {
      return;
    }
    this.locationService.getState(country_id).subscribe(result => {
      this.states = result;
    });
  }

  getCity(type) {
    let state_id = this.vendor.state;
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

  beforeUpload = (files: FileList, type) => {
    if (type == "address") {
      this.uploading = true;
    } else if (type == "sign") {
      this.uploadingSign = true;
    }
    const formData = new FormData();
    for (let file of files as any) {
      formData.append('document', file);
    }
    this.commonService.uploadDocument(formData).subscribe(
      data => {
        if (type == "address") {
          this.vendor.gst_add_proof_file = [...this.vendor.gst_add_proof_file, ...data.files];
          this.uploading = false;
        } else if (type == "sign") {
          this.vendor.gst_add_proof_sign = [...this.vendor.gst_add_proof_sign, ...data.files];
          this.uploadingSign = false;
        }
      }
    )
    return false;
  }

  beforeUploadLogo = (file: FileList) => {
    if (this.fileListLogo.length > 0) {
      return;
    }
    this.uploadingLogo = true;
    const formData = new FormData();
    formData.append('images', file[0]);
    this.commonService.upload(formData).subscribe(
      data => {
        this.fileListLogo = [...this.fileListLogo, ...data.files];
        this.uploadingLogo = false;
      }
    )
    return false;
  }

  removeImage(image, index, type) {
    this.commonService.removeImage({ "image": image }).subscribe(
      data => {
        if (type == 'imageLogo')
          this.fileListLogo.splice(index, 1);
      },
      error => {

      }
    )
  }

  removeDocument(document, index, type) {
    this.commonService.removeDocument({ "document": document }).subscribe(
      data => {
        if (type == 'address')
          this.vendor.gst_add_proof_file.splice(index, 1);

        if (type == 'sign')
          this.vendor.gst_add_proof_sign.splice(index, 1);
      },
      error => {

      }
    )
  }

  setValues() {
    this.vendor = {};
    this.vendor.email = '';
    this.vendor.password = '';
    this.vendor.name = '';
    this.vendor.mobile = '';
    this.vendor.address = '';
    this.vendor.pincode = '';
    this.vendor.city = '';
    this.vendor.state = '';
    this.vendor.country = 101;
    this.vendor.is_gst = '0';
    this.vendor.gst_number = '';
    this.vendor.gst_bussiness_name = '';
    this.vendor.gst_pan = '';
    this.vendor.gst_bussiness_type = 'proprietor';
    this.vendor.gst_add_room = '';
    this.vendor.gst_add_street = '';
    this.vendor.gst_add_pincode = '';
    this.vendor.gst_add_city = '';
    this.vendor.gst_add_state = '';
    
    this.vendor.gst_add_proof_file = [];
    this.vendor.gst_add_proof_sign = [];
    this.vendor.is_bank = '0';
    this.vendor.bank_acc_holder_name = '';
    this.vendor.bank_acc_number = '';
    this.vendor.from_admin = 'yes';
    this.vendor.status = 'active';
  }

  setForm() {
    this.vendorForm = this.fb.group({
      email: [this.vendor.email, [Validators.email, Validators.required, Validators.maxLength(255), Validators.minLength(2)]],
      password: [this.vendor.password, [Validators.required, Validators.minLength(8), Validators.maxLength(255)]],
      name: [this.vendor.name, [Validators.required, Validators.maxLength(255), Validators.minLength(2)]],
      status: [this.vendor.status, [Validators.required]],
      mobile: [this.vendor.mobile, [Validators.required, Validators.minLength(10), Validators.maxLength(10), ValidateNumber]],
      address: [this.vendor.address, [Validators.required, Validators.maxLength(255), Validators.minLength(2)]],
      pincode: [this.vendor.pincode, [Validators.required, ValidateNumber]],
      city: [this.vendor.city, [Validators.required]],
      state: [this.vendor.state, [Validators.required]],
      is_gst: [this.vendor.is_gst, [Validators.required]],
      gst_number: [this.vendor.gst_number, []],
      gst_bussiness_name: [this.vendor.gst_bussiness_name, []],
      gst_pan: [this.vendor.gst_pan, []],
      gst_bussiness_type: [this.vendor.gst_bussiness_type, []],
      gst_add_room: [this.vendor.gst_add_room, []],
      gst_add_street: [this.vendor.gst_add_street, []],
      gst_add_pincode: [this.vendor.gst_add_pincode, []],
      gst_add_city: [this.vendor.gst_add_city, []],
      gst_add_state: [this.vendor.gst_add_state, []],
      gst_add_proof_file: [this.vendor.gst_add_proof_file, []],
      gst_add_proof_sign: [this.vendor.gst_add_proof_sign, []],
      is_bank: [this.vendor.is_bank, [Validators.required]],
      bank_acc_holder_name: [this.vendor.bank_acc_holder_name, []],
      bank_acc_number: [this.vendor.bank_acc_number, []]
    });
  }

  handleResponse(data) {
    this.isSubmitLoading = false;
    this.submitted = false;
    if (data.status == true) {
      this.VendorAddEditModal = false;
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
