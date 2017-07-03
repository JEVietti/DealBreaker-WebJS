import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms'
import {FlashMessagesService} from 'angular2-flash-messages';
import {AuthService} from '../../services/auth.service'
import {Router, ActivatedRoute, Params} from '@angular/router';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.css']
})
export class UpdatePasswordComponent implements OnInit {
  
  password: String;
  cpassword: String;
  token: String;
  constructor(
    private flashMessage: FlashMessagesService, 
    private auth: AuthService,
     private route: ActivatedRoute,
     private router: Router
    ) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params)=>{
      this.token = params['token'];
      // console.log(this.token);
    });
  }

  resetPassword(){
    const update = {
      password: this.password,
      cpassword: this.cpassword,
      token: this.token  
    }

    if(this.validateForm(update)){
      this.auth.resetPassword(update).subscribe(data => {
        if(data.success){
      this.flashMessage.show( data.msg || "Password Updated Successfully", {cssClass: 'alert-success', timeout: 3000})        
        this.router.navigate(['/login'])
      } else {
          this.flashMessage.show( data.msg || "Something went wrong check fields", {cssClass: 'alert-danger', timeout: 3000})
          this.router.navigate(['/login'])
      }
      })
    } 
  }

  updatePassword(){
    
    const update = {
      password: this.password,
      cpassword: this.cpassword  
    }

    if(this.validateForm(update)){
      this.auth.updatePassword(update).subscribe(data => {
        if(data.success){
      this.flashMessage.show( data.msg || "Password Updated Successfully", {cssClass: 'alert-success', timeout: 3000})        
        } else {
          this.flashMessage.show( data.msg || "Something went wrong check fields", {cssClass: 'alert-danger', timeout: 3000})
        }
      })
    } 

  }

  validateForm(update){
    if (update.password == undefined || update.cpassword == undefined) {
      this.flashMessage.show("Fill in all fields.", {cssClass: 'alert-danger', timeout: 3000})
      return false
    } 
    
    else if (update.password != update.cpassword) {
      this.flashMessage.show("Passwords do not match.", {cssClass: 'alert-danger', timeout: 3000})
      return false
    }

     return true
  }

}
