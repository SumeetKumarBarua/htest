import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule, Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { ClarityModule } from '@clr/angular';
import { UiModule } from './ui/ui.module';
import { LoginFormComponent } from './login-form/login-form.component';
import {RouterModule, Routes} from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { CeoComponent } from './ceo/ceo.component';
import { TechnicianComponent } from './technician/technician.component';
import { LayoutComponent } from './ui/layout/layout.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChartsModule } from 'ng2-charts';
import { CookieService } from 'ngx-cookie-service';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
//import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';






const appRoutes:Routes=[
  {
    path:'',
    component:LoginFormComponent
  },  
  {
    path:'admin',
    component:AdminComponent
  },
  {
    path:'technician',
    component:TechnicianComponent
  },
  {
    path:'ceo',
    component:CeoComponent
  }
  
]

@NgModule({
  declarations: [
    AppComponent,
    LoginFormComponent,
    AdminComponent,
    TechnicianComponent,
    CeoComponent    
    
  ],
  imports: [
    BrowserModule,CoreModule,           // Singleton objects (services, components that are loaded only once, etc.)
    SharedModule ,         // Shared (multi-instance) objects
    ClarityModule.forRoot(),
    NgbModule.forRoot(),
    ChartsModule,
    UiModule,
    FormsModule,
    RouterModule.forRoot(appRoutes),
    HttpModule,
    BrowserAnimationsModule,
    ReactiveFormsModule
  ],
  exports: [
    RouterModule,
  ],
  providers: [CookieService],  
  bootstrap: [AppComponent]
})
export class AppModule { }
//platformBrowserDynamic().bootstrapModule(AppModule)