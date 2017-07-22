import { Component, OnInit } from '@angular/core';
import { BrowseService } from '../../services/browse.service'
import { ProfileService } from '../../services/profile.service'
import { Subscription } from "rxjs/Subscription";
import {Router, ActivatedRoute, Params} from '@angular/router';

import 'rxjs/add/operator/map';


@Component({
  selector: 'app-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.css']
})

export class BrowseComponent implements OnInit {
  private preferences: Map<String, any>;
  private profile: any;
  constructor(private browseService: BrowseService) { 
    this.loadPreferences()
  }

  ngOnInit() {
   this.browse()
  }

  loadPreferences() {
    this.preferences = new Map()
    this.preferences.set('age', 10)    
    this.preferences.set('sex', 'Female')    
    this.preferences.set('orientation', 'Heterosexual')    
    this.preferences.set('location', 100)    
    this.preferences.set('baseLocation', [41.8781136, -87.63])    
  
  }

  browse(){
     this.browseService.getProfiles(this.preferences).subscribe(res => {
      console.log(res.profiles)
      this.browseService.fetchProfiles(res.profiles)
      this.profile = res.profiles
      
    })
  }

  setSexPref() {

  }

  setOrientationPref() {

  }

  setAgePref() {

  }

}
