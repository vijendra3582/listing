import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HeaderComponent implements OnInit {

  menuNotification: boolean = false;
  menuEvent: boolean = false;
  menuMessage: boolean = false;
  adminMenu = [];
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }
  ngOnInit() {
    this.setAdminMenu();
  }

  setAdminMenu() {
    this.adminMenu = [
      {
        "title": "Category",
        "link": "/category"
      },
      {
        "title": "Sub Category",
        "link": "/sub-category"
      },
      {
        "title": "Brand",
        "link": "/brand"
      },
      {
        "title": "Products",
        "link": "/product"
      },
      {
        "title": "Import Product",
        "link": "/import-product"
      },
      {
        "title": "Orders",
        "link": "/order"
      },
      {
        "title": "Users",
        "link": "/user"
      },
      {
        "title": "Vendors",
        "link": "/vendor"
      },
      {
        "title": "Staff",
        "link": "/staff"
      }
    ];
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/auth/login');
  }
}
