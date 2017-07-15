/* Navbar Created with Materialize.css
 * uses jquery for materialize.css instantiation
 * as well as protecting routes protected with AuthGuard 
 * 
 * Navbar transforms based on size from horizontal navigation
 * to a side bar based on pixel width using materialize and houses the way to logout
 * Logging out is clearing the tokens from the local storage in browser upon login
 *  
*/

import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';

declare const Materialize: any;
declare const $: any;

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

export class NavbarComponent implements OnInit {

  public name: String;
  private login: Boolean;
  constructor(
      private authService: AuthService,
      private router: Router,
      private routerMod: RouterModule
  ) {    this.login = false;
          
   }

  ngOnInit() {
   
 
  }

  //Insert Javascript/Jquery - in this case toggle the navbar on clicks of changing page
  ngAfterContentInit() {
     $(document).ready(()=> {
        this.initMaterialize()
     });
  }

  ngOnChanges(){
  }

  // MaterializeCSS Jquery Initialization Functions
  initMaterialize(){
    $(document).ready(function() {
      
      $(".button-collapse").sideNav();
      
      $('.tooltipped').tooltip();
      // setTimeout(function(){$(".tooltip").trigger("mouseleave.tooltip");}, 2000);
      
      $(".dropdown-button").dropdown({
        hover: true,
        stopPropagation: false // Stops event propagation
      });
      
      $('.button-collapse').sideNav({
        menuWidth: 200, // Default is 300
        edge: 'left', // Choose the horizontal origin
        closeOnClick: true, // Closes side-nav on <a> clicks, useful for Angular/Meteor
        draggable: true // Choose whether you can drag to open on touch screens
      });
    });
  }

  

//Logout Notify the user of logout and destroy the tokens in local storage using AuthService
//route back to home after logout
   onLogoutClick(){
    this.authService.logout(); //clear local storage
    
    //Notify User
    // Materialize.toast('You logged out!', 5000, 'rounded')
    //Navigate back to home page
    this.router.navigate(['/']);
    return true;
  }


}
