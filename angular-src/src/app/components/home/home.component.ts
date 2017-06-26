/* Home Component: Landing Page for Website Description
 * As well as some small navigation and suggestions such as
 * what the website does for the user as well as 
 * the directing the user to register and login.
 * 
 * 
*/

import { Component, OnInit } from '@angular/core';
declare const $: any;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
//Insert Javascript/Jquery - in this case toggle the navbar on clicks of changing page
  ngAfterContentInit() {
        $(document).ready(function() {
                $('.parallax').parallax();
        });
  }

}
