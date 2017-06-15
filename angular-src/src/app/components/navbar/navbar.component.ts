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
    $(document).on('click','.navbar-collapse.in',function(e) {
      if( $(e.target).is('a') && $(e.target).attr('class') != 'dropdown-toggle' ) {
          $(this).collapse('hide');
      }
    });
  }

   onLogoutClick(){
    this.authService.logout();
    this.flashMessage.show('You are logged out', {
      csClass:"alert-success",
      timeout: 3000
    });
    this.router.navigate(['/']);
    return true;
  }


}
