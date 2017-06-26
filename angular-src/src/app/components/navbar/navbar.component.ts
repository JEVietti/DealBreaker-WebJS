/* Navbar Created with Materialize.css
 * uses jquery for materialize.css instantiation
 * as well as protecting routes with AuthGuard 
 * 
 * Navbar transforms based on size from horizontal navigation
 * to a side bar based on pixel width using materialize and houses the way to logout
 * Logging out is clearing the tokens from the local stroage in browser upon login
 *  
*/

import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {FlashMessagesService} from 'angular2-flash-messages';

declare const $: any;

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

export class NavbarComponent implements OnInit {

  

  constructor(
      private authService: AuthService,
      private flashMessage: FlashMessagesService,
      private router: Router
  ) { }

  ngOnInit() {

  }

  //Insert Javascript/Jquery - in this case toggle the navbar on clicks of changing page
  ngAfterContentInit() {
        $(document).ready(function() {
                $(".button-collapse").sideNav();
                $('.button-collapse').sideNav({
      menuWidth: 200, // Default is 300
      edge: 'left', // Choose the horizontal origin
      closeOnClick: true, // Closes side-nav on <a> clicks, useful for Angular/Meteor
      draggable: true // Choose whether you can drag to open on touch screens
    }
  );
        });
  }

//Logout Notify the user of logout and destroy the tokens in local storage using AuthService
//route back to home after logout
   onLogoutClick(){
    this.authService.logout(); //clear local storage
    
    //Notify User
    this.flashMessage.show('You are logged out', {
      csClass:"alert-success",
      timeout: 3000
    });

    //Navigate back to home page
    this.router.navigate(['/']);
    return true;
  }


}
