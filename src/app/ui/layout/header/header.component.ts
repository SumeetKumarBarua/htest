import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: []
})


export class HeaderComponent implements OnInit {

  user:any="";
  designation:any="";

  constructor(private router:Router, private cookieService: CookieService) { }
  
  ngOnInit() {
    this.user = this.cookieService.get('User');
    this.designation = this.cookieService.get('Designation');
  }

  
}
