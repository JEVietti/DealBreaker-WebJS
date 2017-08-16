import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router'
import { BrowseService } from '../../services/browse.service'
import { RelationshipService } from '../../services/relationship.service'
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-action-card',
  templateUrl: './action-card.component.html',
  styleUrls: ['./action-card.component.css']
})
export class ActionCardComponent implements OnInit {
  @Input() private data: any;

  private profile: any;

  // Subscriptions

  constructor(private router: Router, private relationshipService: RelationshipService, private profileService: ProfileService) { }

  ngOnInit() {
    console.log(this.data)
    if (this.data === undefined) {
      // this.fetchProfiles()
    } else if (this.data !== undefined) {
      this.profile = this.data
      this.profile.age = this.profileService.calculateAge(this.data.birthdate)
    }
  }

  quickAdd(profile, index) {
    console.log(profile)
    console.log(index)
    this.profile.status = 'requesting'
    // this.profiles.splice(index, 1)
    this.relationshipService.profileToAdd(profile, index)
    // Materialize.toast('Request Sent!')
  }

  quickAddRevert(profile, index) {
    console.log(profile)
    console.log(index)
    this.profile.status = undefined
    // this.profiles.splice(index, 1)    
    this.relationshipService.profileToRemoveRequest(profile, index)
    // Materialize.toast('Request Sent!')
  }

  quickReject(profile, index) {
    console.log(profile)
    console.log(index)
    this.profile.status = 'reject'
    // this.profiles.splice(index, 1)
    this.relationshipService.profileToReject(profile, index)
  }

  quickConfirm(profile, index) {
    console.log(profile)
    console.log(index)
    this.profile.status = 'reject'
    // this.profiles.splice(index, 1)
    this.relationshipService.profileToConfirm(profile, index)
  }

  quickRejectConfirm(profile, index) {
    console.log(profile)
    console.log(index)
    this.profile.status = 'reject'
    // this.profiles.splice(index, 1)
    this.relationshipService.profileToRejectConfirm(profile, index)
  }

  quickRejectRevert(profile, index) {
    console.log(profile)
    console.log(index)
    // this.profiles.splice(index, 1)
    this.profile.status = undefined
    this.relationshipService.profileToRemoveReject(profile, index)
    // Materialize.toast('Request Sent!')
  }
}
