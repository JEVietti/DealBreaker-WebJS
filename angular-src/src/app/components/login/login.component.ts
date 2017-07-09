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
import {FlashMessagesService} from 'angular2-flash-messages';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';

declare const Materialize: any;


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username: String;
  password: String;

  constructor(
      private validateService: ValidateService, 
      private flashMessage: FlashMessagesService,
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
      this.authService.authenticateUser(user).subscribe(data => {
      //console.log(data); - data from server api, 
      if(data.success){
        Materialize.toast("You are now logged in!", 500, 'rounded toast-success');
          this.authService.storeUserData(data.token, data.user);
           setInterval(()=>{
           window.location.replace('/profile')    
          }, 600)
      }
      else{
        Materialize.toast(data.msg,  1000, 'rounded toast-danger');
        setInterval(()=>{
          this.router.navigate(['/login']);      
        }, 1000)
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

}
