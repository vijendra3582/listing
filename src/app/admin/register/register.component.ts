import { Component, OnInit } from '@angular/core';
import { ConstantsService } from 'src/app/services/constants.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormControl, FormBuilder } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd';
import { CommonService } from 'src/app/services/common.service';
import { LocationService } from 'src/app/services/location.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  submitted = false;
  server_message: any = {};
  registerData: any = {};
  globalData: any = {};

  states: any = [];
  cities: any = [];

  citiesGST: any = [];

  currentStepForm = 0;

  uploading: boolean = false;
  uploadingSign: boolean = false;

  constructor(
    private fb: FormBuilder,
    private locationService: LocationService,
    private authService: AuthService,
    private siteData: ConstantsService,
    private commonService: CommonService,
    private router: Router,
    private responseMessage: NzMessageService
  ) { }

  ngOnInit() {
    this.globalData = this.siteData;
    this.setValues();
    this.setForm();
    this.getState();
  }

  pre(): void {
    this.currentStepForm -= 1;
  }

  next(): void {
    this.currentStepForm += 1;
  }

  getState() {
    let country_id = this.registerData.country;
    if (!country_id) {
      return;
    }
    this.locationService.getState(country_id).subscribe(result => {
      this.states = result;
    });
  }

  getCity(type) {
    let state_id = this.registerData.state;
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
	if(type == "address"){
	  this.uploading = true;
	}else if(type == "sign"){
	  this.uploadingSign = true;
	}
    const formData = new FormData();
    for (let file of files as any) {
      formData.append('document', file);
    }
    this.commonService.uploadDocument(formData).subscribe(
      data => {
        if(type == "address"){
          this.registerData.gst_add_proof_file = [...this.registerData.gst_add_proof_file, ...data.files];
		  this.uploading = false;
        }else if(type == "sign"){
          this.registerData.gst_add_proof_sign = [...this.registerData.gst_add_proof_sign, ...data.files];
		  this.uploadingSign = false;
        }
      }
    )
    return false;
  }

  removeDocument(document, index, type) {
    this.commonService.removeDocument({ "document": document }).subscribe(
      data => {
        if (type == 'address')
          this.registerData.gst_add_proof_file.splice(index, 1);

        if (type == 'sign')
          this.registerData.gst_add_proof_sign.splice(index, 1);
      },
      error => {

      }
    )
  }

  setValues() {
    this.registerData.email = null;
    this.registerData.password = null;
    this.registerData.confirm_password = null;
    this.registerData.name = null;
    this.registerData.mobile = null;
    this.registerData.address = null;
    this.registerData.pincode = null;
    this.registerData.city = null;
    this.registerData.state = null;
    this.registerData.country = 101;
    this.registerData.is_gst = 0;
    this.registerData.gst_number = null;
    this.registerData.gst_bussiness_name = null;
    this.registerData.gst_pan = null;
    this.registerData.gst_bussiness_type = "proprietor";
    this.registerData.gst_add_room = null;
    this.registerData.gst_add_street = null;
    this.registerData.gst_add_pincode = null;
    this.registerData.gst_add_city = null;
    this.registerData.gst_add_state = null;
    this.registerData.gst_add_proof_file = [];
    this.registerData.gst_add_proof_sign = [];
    this.registerData.is_bank = 0;
    this.registerData.bank_acc_holder_name = null;
    this.registerData.bank_acc_number = null;
  }

  setForm() {
    this.registerForm = this.fb.group({
      email: [this.registerData.email, [Validators.email, Validators.required]],
      password: [this.registerData.password, [Validators.required, Validators.minLength(8)]],
      confirm_password: [this.registerData.confirm_password, [Validators.required, this.confirmationValidator]],
      name: [this.registerData.name, [Validators.required]],
      mobile: [this.registerData.mobile, [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      address: [this.registerData.address, [Validators.required]],
      pincode: [this.registerData.pincode, [Validators.required]],
      city: [this.registerData.city, [Validators.required]],
      state: [this.registerData.state, []],
      is_gst: [this.registerData.is_gst, []],
      gst_number: [this.registerData.gst_number, []],
      gst_bussiness_name: [this.registerData.gst_bussiness_name, []],
      gst_pan: [this.registerData.gst_pan, []],
      gst_bussiness_type: [this.registerData.gst_bussiness_type, []],
      gst_add_room: [this.registerData.gst_add_room, []],
      gst_add_street: [this.registerData.gst_add_street, []],
      gst_add_pincode: [this.registerData.gst_add_pincode, []],
      gst_add_city: [this.registerData.gst_add_city, []],
      gst_add_state: [this.registerData.gst_add_state, []],
      gst_add_proof_file: [this.registerData.gst_add_proof_file, []],
      gst_add_proof_sign: [this.registerData.gst_add_proof_sign, []],
      is_bank: [this.registerData.is_bank, []],
      bank_acc_holder_name: [this.registerData.bank_acc_holder_name, []],
      bank_acc_number: [this.registerData.bank_acc_number, []]
    });
  }

  register() {
    this.submitted = true;
    this.authService.registerVendor(this.registerData).subscribe(
      data => this.handleResponse(data),
      error => this.handleError(error)
    );
  }

  handleResponse(data) {
    if (data.status == true) {
      this.responseMessage.success(data.message, { nzDuration: 2000 });
      this.router.navigateByUrl('/auth/login');
    } else {
      this.responseMessage.error(data.message, { nzDuration: 2000 });
    }
  }

  handleError(error) {
    this.server_message = error.error.message.errors;
  }

  confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.registerForm.controls.password.value) {
      return { confirm: true, error: true };
    }
    return {};
  }

  updateConfirmValidator(): void {
    Promise.resolve().then(() => this.registerForm.controls.confirm_password.updateValueAndValidity());
  }
}
