import { Component, OnInit } from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
import 'rxjs';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',  
  styles: []
})
export class LayoutComponent implements OnInit {

  constructor(private http: Http) { }

  
  ngOnInit() {
  }

}
