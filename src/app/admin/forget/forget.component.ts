import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ConstantsService } from 'src/app/services/constants.service';

@Component({
  selector: 'app-forget',
  templateUrl: './forget.component.html',
  styleUrls: ['./forget.component.scss']
})
export class ForgetComponent implements OnInit {
  forgetForm: FormGroup;
  submitted = false;
  server_message: any = {};
  globalData: any = {};

  constructor(
    private siteData: ConstantsService,
  ) { }

  ngOnInit() {
    this.globalData = this.siteData;
    this.forgetForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
    });
  }

  forget(){
    
  }

}
