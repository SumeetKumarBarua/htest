import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main',
  template: `    
    <ng-content> </ng-content>      
  <app-sidebar></app-sidebar>

  `,
  styles: []
})
export class MainComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
