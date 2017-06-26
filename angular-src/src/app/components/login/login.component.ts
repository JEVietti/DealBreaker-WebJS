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
        this.flashMessage.show("You are now logged in!", {
          cssClass: 'alert-success', 
          timeout: 5000});
          this.authService.storeUserData(data.token, data.user);
          this.router.navigate(['/dashboard']);
      }
      else{
        this.flashMessage.show(data.msg, {
          cssClass: 'alert-danger', 
          timeout: 5000});
          this.router.navigate(['/login']);
      }
      });
    }
    else{
      this.flashMessage.show("Please Fill in all Fields!", {
          cssClass: 'alert-danger', 
          timeout: 3000});
    }
    
  }

  private validateLogin(user){
    return this.validateService.validateLogin(user);
  }

}
