import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ValidateNumber } from 'src/app/validations/custom.validators';
import { NzMessageService } from 'ng-zorro-antd';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { ConstantsService } from 'src/app/services/constants.service';
import { AuthService } from 'src/app/services/auth.service';
import { LocationService } from 'src/app/services/location.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.scss']
})
export class RegisterUserComponent implements OnInit {

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
    private titleService: Title,
    private responseMessage: NzMessageService
  ) { 
    this.titleService.setTitle('User Registration - Most Market');
  }

  ngOnInit() {
    this.globalData = this.siteData;
    this.setValues();
    this.setForm();
    this.getState();
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

  setValues() {
    this.registerData.email = '';
    this.registerData.password = '';
    this.registerData.confirm_password = '';
    this.registerData.name = '';
    this.registerData.mobile = '';
    this.registerData.address = '';
    this.registerData.city = '';
    this.registerData.state = '';
    this.registerData.country = 101;
    this.registerData.profession = '';
  }

  setForm() {
    this.registerForm = this.fb.group({
      email: [this.registerData.email, [Validators.email, Validators.required, Validators.maxLength(255), Validators.minLength(2)]],
      password: [this.registerData.password, [Validators.required, Validators.minLength(8)]],
      confirm_password: [this.registerData.confirm_password, [Validators.required, this.confirmationValidator]],
      name: [this.registerData.name, [Validators.required, Validators.maxLength(255), Validators.minLength(2)]],
      mobile: [this.registerData.mobile, [Validators.required, Validators.minLength(10), Validators.maxLength(10), ValidateNumber]],
      address: [this.registerData.address, [Validators.required, Validators.maxLength(255), Validators.minLength(2)]],
      city: [this.registerData.city, [Validators.required]],
      state: [this.registerData.state, [Validators.required]],
      profession: [this.registerData.profession, [Validators.required]]
    });
  }

  register() {
    this.submitted = true;
    this.authService.registerUser(this.registerData).subscribe(
      data => this.handleResponse(data),
      error => this.handleError(error)
    );
  }

  handleResponse(data) {
    if (data.status == true) {
      this.currentStepForm = 0;
      this.setValues();
      this.responseMessage.success(data.message, { nzDuration: 2000 });
      // this.router.navigateByUrl('/auth/login');
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
