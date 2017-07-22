import { Component, OnInit } from '@angular/core';
import {BrowseService} from '../../services/browse.service'

declare const $: any;

@Component({
  selector: 'app-profile-card',
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.css']
})

export class ProfileCardComponent implements OnInit {
  private profiles: Array<Object>;
  constructor(private browseService: BrowseService) { this.profiles = [] }

  ngOnInit() {
    this.fetchProfiles()
  }

  ngAfterContentInit(){
   
  }

  fetchProfiles(){
    this.browseService.listenProfiles().subscribe(res => {
      console.log('Listen')  
      console.log(res)  
      if(this.profiles.length == 0) {
        this.profiles = res
      } else {
        this.profiles.concat(res)
      }      
      this.initMaterialize()
    })
  }

  initMaterialize(){
     $(document).ready(function(){
      $('ul.tabs').tabs({
        
      });
    });
  }

}
