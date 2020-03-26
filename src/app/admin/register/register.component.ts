import { Component, OnInit } from '@angular/core';
import { ConstantsService } from 'src/app/services/constants.service';
import { AuthService } from 'src/app/services/auth.service';
import { TokenService } from 'src/app/services/token.service';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormControl, FormBuilder } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd';

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
  
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private siteData: ConstantsService,
    private router: Router,
    private responseMessage: NzMessageService
  ) { }

  ngOnInit() {
    this.globalData = this.siteData;
    this.setForm();
  }

  setValues() {
    this.registerData.email = '';
    this.registerData.password = '';
    this.registerData.confirm_password = '';
    this.registerData.name = '';
    this.registerData.mobile = '';
  }

  setForm() {
    this.registerForm = this.fb.group({
      email: [null, [Validators.email, Validators.required]],
      password: [null, [Validators.required, Validators.minLength(8)]],
      confirm_password: [null, [Validators.required, this.confirmationValidator]],
      name: [null, [Validators.required]],
      mobile: [null, [Validators.required, Validators.minLength(10), Validators.maxLength(10)]]
    });
  }

  register() {
    this.submitted = true;
    this.authService.register(this.registerData).subscribe(
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
