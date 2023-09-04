import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BnNgIdleService } from 'bn-ng-idle';
import { Constant } from './services/Contant';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Company';
  autoLogoutTime = 0; // in second
  constructor(private router : Router, private bnIdle: BnNgIdleService){
    this.autoLogoutTime = Constant.AUTO_LOGOUT_TIME;
    this.bnIdle.startWatching(this.autoLogoutTime).subscribe((res) => {
      if(res) {
        this.router.navigate(['/login']);
      }
    })
  }
}
