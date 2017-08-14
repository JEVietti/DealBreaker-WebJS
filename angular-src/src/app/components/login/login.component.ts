/*
 *
 * 
 * 
 * 
 * 
 *  
*/

import { Component, OnInit } from '@angular/core';
import {ValidateService} from '../../services/validate.service';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import { NgForm, FormsModule } from '@angular/forms';
import { Subscription } from "rxjs/Subscription";


declare const Materialize: any;


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username: String;
  password: String;

  authSub: Subscription;

  constructor(
      private validateService: ValidateService, 
      private authService: AuthService,
      private router: Router

  ) { }

  ngOnInit() {
  }

  onLoginSubmit(){
    const user = {
      username: this.username,
      password: this.password
    }
    if(this.validateLogin(user)){
      this.authSub = this.authService.authenticateUser(user).subscribe(data => {
      //console.log(data); - data from server api, 
      if(data.success){
        Materialize.toast("You are now logged in!", 500, 'rounded toast-success');
          this.authService.storeUserData(data.token, data.user);
           setTimeout(()=>{
           window.location.replace('/dashboard')    
          }, 600)
      }
      else{
        Materialize.toast(data.msg,  1000, 'rounded toast-danger');
      }
      });
    }
    else{
      Materialize.toast("Please Fill in all Fields!", 3000, 'toast-danger rounded');
    }
    
  }

  private validateLogin(user){
    return this.validateService.validateLogin(user);
  }

  ngOnDestroy(){
    if(this.authSub != null){
      this.authSub.unsubscribe()
    }
  }

}
