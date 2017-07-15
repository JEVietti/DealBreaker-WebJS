import { Component, OnInit } from '@angular/core';

import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.css']
})
export class TermsComponent implements OnInit {

  constructor(private router: RouterModule) { }

  ngOnInit() {
  }

}
