import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout/layout.component';
import { HeaderComponent } from './layout/header/header.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { MainComponent } from './layout/main/main.component';
import { ClarityModule } from '@clr/angular';
import {RouterModule, Routes} from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  imports: [
    NgbModule.forRoot(),
    CommonModule,
    ClarityModule,
    RouterModule,
    BrowserAnimationsModule
  ],
  declarations: [LayoutComponent, HeaderComponent, SidebarComponent, MainComponent],
  exports:[LayoutComponent]
})
export class UiModule { }
