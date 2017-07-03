import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {ValidateService} from '../../services/validate.service';
import {FlashMessagesService} from 'angular2-flash-messages';

import 'rxjs/add/operator/map';

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
          this.flashMessage.show( res.msg || "Success, check your email to retrieve your username.", {cssClass: 'alert-success', timeout: 3000})                
        } else {
          this.flashMessage.show( res.msg ||  "Unknkown error try again.", {cssClass: 'alert-danger', timeout: 5000})      
        }
      })
    } /*else {
      this.flashMessage.show("Unknkown error try again.", {cssClass: 'alert-danger', timeout: 5000})      
    }*/
  }

  forgotPassword(){
    const forgot = {
      email: this.email
    }
    
    if(this.validateInput(forgot)){
      this.auth.forgotPassword(forgot).subscribe (res => {
         if(res.success){
          this.flashMessage.show( res.msg || "Success, check your email for further instruction to reset your password.", {cssClass: 'alert-success', timeout: 3000})                
        } else {
          this.flashMessage.show( res.msg ||  "Unknkown error try again.", {cssClass: 'alert-danger', timeout: 5000})      
        }
      })
    } /*else {
      this.flashMessage.show("Unknkown error try again.", {cssClass: 'alert-danger', timeout: 5000})      
    }*/
  }

  validateInput(forgot){
    if (forgot.email == null){
      this.flashMessage.show("Fill in all fields.", {cssClass: 'alert-danger', timeout: 3000})
      return false;
    } 
    else if (!this.validate.validateEmail(forgot.email)){
      this.flashMessage.show("Emails invalid.", {cssClass: 'alert-danger', timeout: 5000})      
      return false
    } 
    return true
  }

}

  
