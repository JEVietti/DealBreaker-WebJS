import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {ValidateService} from '../../services/validate.service';
import {FlashMessagesService} from 'angular2-flash-messages';

import 'rxjs/add/operator/map';
declare const Materialize: any;

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.css']
})
export class ForgotComponent implements OnInit {
  id: String;
  email: String;

  constructor(
    private route: ActivatedRoute,
    private router: Router,    
    private validate: ValidateService,
    private auth: AuthService,
    private flashMessage: FlashMessagesService
  ) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params)=>{
      this.id = params['id'];
      if(this.id != "username" && this.id != "password"){
        this.router.navigate(["/"]);
      } 
   });
  }

  forgotUsername(){
    const forgot = {
      email: this.email
    }

    if(this.validateInput(forgot)){
      this.auth.forgotUsername(forgot).subscribe (res => {
        if(res.success){
          Materialize.toast( res.msg || "Success, check your email to retrieve your username.", 3000, 'rounded toast-success')                
        } else {
          Materialize.toast( res.msg ||  "Unknown error try again.", 5000, 'rounded toast-danger')      
        }
      })
    } /*else {
      Materialize.toast("Unknown error try again.", {cssClass: 'alert-danger', timeout: 5000})      
    }*/
  }

  forgotPassword(){
    const forgot = {
      email: this.email
    }
    
    if(this.validateInput(forgot)){
      this.auth.forgotPassword(forgot).subscribe (res => {
         if(res.success){
          Materialize.toast( res.msg || "Success, check your email for further instruction to reset your password.", 3000, 'rounded toast-success')                
        } else {
          Materialize.toast( res.msg ||  "Unknown error try again.", 5000, 'rounded toast-danger')      
        }
      })
    } /*else {
      Materialize.toast("Unknown error try again.", {cssClass: 'alert-danger', timeout: 5000})      
    }*/
  }

  validateInput(forgot){
    if (forgot.email == null){
      Materialize.toast("Fill in all fields.", 3000, 'rounded toast-success')
      return false;
    } 
    else if (!this.validate.validateEmail(forgot.email)){
      Materialize.toast("Emails invalid.", 5000, 'rounded toast-danger')      
      return false
    } 
    return true
  }

}

  
