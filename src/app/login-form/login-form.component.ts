import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Http, Response, Headers} from '@angular/http';
import 'rxjs';
import 'rxjs/add/operator/map';
import {Router} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/empty';
import 'rxjs/add/operator/retry';
import { map, catchError } from 'rxjs/operators';
import 'rxjs/add/observable/throw';
import { CookieService } from 'ngx-cookie-service';


import { HttpErrorResponse, HttpResponse } from '@angular/common/http';


@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {

  data:object = {};
  error:boolean=false;
  Obj:object = {};
  loginForm: FormGroup;

  private headers = new Headers(
    { 'content-type': 'application/x-www-form-urlencoded',      
      'Authorization':'Basic aWFtLWNsaWVudDppYW0tc2VjcmV0'});

  
  constructor(private router:Router, private http: Http, private cookieService: CookieService,
              private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username:      ['', [ Validators.required ]],
      password:   ['', [ Validators.required ]]
  });
  }

  
  loginUser(e){      
      var username=e.target.elements[0].value;
      var password=e.target.elements[1].value;
      this.Obj = {
        "username": username,
        "password": password,
        "grant_type": "password"
      };
      var data = "username="+username+"&password="+password+"&grant_type=password";
      console.log(data);

      if((username==='admin' && password==='admin') || (username==='user1' && password==='user1')
                                                    || (username==='user2' && password==='user2') 
                                                    || (username==='ceo' && password==='ceo')){
        if(username==='admin'){
          this.cookieService.set( 'User', username );
          this.cookieService.set( 'Designation', "Admin" );
          this.router.navigate(['admin']);
        }
        else if(username==='user1'){
          this.cookieService.set( 'User', username );
          this.cookieService.set( 'Designation', "Traffic Controller" );
          this.router.navigate(['admin']);
        }
        else if(username==='user2'){
          this.cookieService.set( 'User', username );
          this.cookieService.set( 'Designation', "Technician" );
          this.router.navigate(['technician']);
        }
        else if(username==='ceo'){
          this.cookieService.set( 'User', username );
          this.cookieService.set( 'Designation', "CEO" );
          this.router.navigate(['ceo']);
        }
         
      }
      else{
        this.error=true;
      }


    //   this.http.post("http://localhost:8080/oauth/token", data, {headers: this.headers})
    //   .subscribe(
    //     data =>{
    //       let results = data;          
    //       console.log("token : "+JSON.stringify(data.json().access_token));
    //       this.cookieService.set( 'User', username );
          
    //       this.router.navigate(['dashboard']);
        
    //     },
    //     err =>{
    //       //console.log("error : "+JSON.stringify(err));
    //       this.error=true;
    //     }    
    // );

      
      
  }
}
