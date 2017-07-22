import { Component, OnInit } from '@angular/core';

declare var $: any;

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  constructor() { }

  ngOnInit() {
      $(document).ready(function(){
    $('ul.tabs').tabs({
        'swipeable': true
      });
  });
        
  }

}
