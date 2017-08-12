/* Home Component: Landing Page for Website Description
 * As well as some small navigation and suggestions such as
 * what the website does for the user as well as 
 * the directing the user to register and login.
 * 
 * 
*/
import { Component, OnInit, AfterContentInit } from '@angular/core';
import { AuthService } from '../../services/auth.service'

declare const $: any;
declare const Materialize: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterContentInit {

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

//Insert Javascript/Jquery - in this case toggle the navbar on clicks of changing page
  ngAfterContentInit() {
    const options = [
      {selector: '.main', offset: 200, callback: function(el) {
        Materialize.showStaggeredList($(el));
      } },
      {selector: '#showcase-img', offset: 200, callback: function(el) {
        Materialize.fadeInImage($(el));
      } }
    ]

    $(document).ready(() => {
      $('.parallax').parallax();
      Materialize.scrollFire(options)
    });
  }

}
