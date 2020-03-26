import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  constructor() { }

  menues = [
    {
      "name": "Dashboard", 
      "link": "admin", 
      "icon": "dashboard"
    },
    {
      "name": "Academy",
      "link": "academy",
      "icon": "home",
      "children": [
        {"name": "Create Academy", "link": "academy/create"},
        {"name": "Manage Academy", "link": "academy/manage"}
      ]
    },
    {
      "name": "Coach",
      "link": "coach",
      "icon": "golf_course",
      "children": [
        {"name": "Create Coach", "link": "coach/create"},
        {"name": "Manage Coach", "link": "coach/manage"}
      ]
    },
    {
      "name": "Student",
      "link": "student",
      "icon": "verified_user",
      "children": [
        {"name": "Create Student", "link": "student/create"},
        {"name": "Manage Student", "link": "student/manage"}
      ]
    }
  ];

  ngOnInit() {
  }

}
