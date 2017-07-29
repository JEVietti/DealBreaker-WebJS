import { Component, OnInit } from '@angular/core';
import {BrowseService} from '../../services/browse.service'
import {RelationshipService} from '../../services/relationship.service'
import {ProfileService} from '../../services/profile.service';

declare const $: any;
declare const Materialize: any;

@Component({
  selector: 'app-profile-card',
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.css']
})

export class ProfileCardComponent implements OnInit {
  private profiles: Array<any>;
  constructor(private relationshipService: RelationshipService, private profileService: ProfileService) { this.profiles = [] }

  ngOnInit() {
    this.fetchProfiles()
  }

  ngAfterContentInit(){
   
  }

  quickAdd(profile, index) {
    console.log(profile)
    console.log(index)
    this.profiles[index].status = 'requesting'
    // this.profiles.splice(index, 1)
    this.relationshipService.profileToAdd(profile, index)
    // Materialize.toast('Request Sent!')
  }

  quickAddRevert(profile, index) {
    console.log(profile)
    console.log(index)
    this.profiles[index].status = undefined
    // this.profiles.splice(index, 1)    
    this.relationshipService.profileToRemoveRequest(profile, index)
    // Materialize.toast('Request Sent!')
  }

  quickReject(profile, index){
    console.log(profile)
    console.log(index)
    this.profiles[index].status = 'reject'    
    // this.profiles.splice(index, 1)    
    this.relationshipService.profileToReject(profile, index)
  }

  quickRejectRevert(profile, index) {
    console.log(profile)
    console.log(index)
    // this.profiles.splice(index, 1)
    this.profiles[index].status = undefined
    this.relationshipService.profileToRemoveReject(profile, index)
    // Materialize.toast('Request Sent!')
  }

  fetchProfiles(){
    this.relationshipService.listenProfiles().subscribe(res => {
      // console.log('Listen')  
      // console.log(res)  
      res.forEach(element => {
        element.age = this.profileService.calculateAge(element.birthdate)     
      });
      
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
      $('.activator').on('click', () => {
        // console.log('activated')       
        setTimeout(function() {
          // console.log('Reveal')
           $('ul.tabs').tabs();
        
        }, 10)
      })
    });
  }

}
