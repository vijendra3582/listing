import { Component, Renderer2 } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { ConstantsService } from 'src/app/services/constants.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'football';
  showAdmin: boolean = false;

  constructor(private renderer: Renderer2, private siteData: ConstantsService, private router: Router) {
    this.title = this.siteData.AppName;
    
    router.events.forEach((event) => {
      if (event instanceof NavigationStart) {
        if (event['url'].includes('auth')) {
          this.showAdmin = false;
        } else {
          this.showAdmin = true;
        }
      }
    });
  }
}
