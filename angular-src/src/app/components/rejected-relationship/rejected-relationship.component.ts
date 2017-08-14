import { Component, OnInit, AfterContentInit } from '@angular/core';
import { RelationshipService } from '../../services/relationship.service'
import { Subscription } from 'rxjs/Subscription';
import {Router, ActivatedRoute, Params} from '@angular/router';

declare const $: any;

@Component({
  selector: 'app-rejected-relationship',
  templateUrl: './rejected-relationship.component.html',
  styleUrls: ['./rejected-relationship.component.css']
})
export class RejectedRelationshipComponent implements OnInit, AfterContentInit {

  private profile: any;
  private profileRejector: Array<any>;
  private profileRejectee: Array<any>;

  constructor( private relationshipService: RelationshipService) {
    this.profileRejectee = []
    this.profileRejector = []
  }

  ngOnInit() {
    this.fetchRejector()
    // this.fetchRejectee()
  }

  ngAfterContentInit() {
      //this.getProfileRequests()
      $(document).ready(function () {
        $('select').material_select();
      });
  }

  fetchRejector() {
    this.relationshipService.getRejectorList().subscribe(res => {
      // console.log(res)
      if (res.profiles && res.profiles.length > 0) {
        console.log(res)
        res.profiles.rejector.forEach(element => {
        element.profile.status = 'reject'
          this.profileRejector.push(element.profile)
        });
      }
      // this.relationshipService.fetchProfiles(this.profileRejector)
    })
  }
/*
  fetchRejectee() {
    this.relationshipService.getRejecteeList().subscribe(res => {
      // console.log(res)
      if(res.profiles.rejectee.length !== 0) {
        res.profiles.rejectee.forEach(element => {
          element.profile.status = 'rejected'
          this.profileRejectee.push(element.profile)
        });
      } 
      // this.relationshipService.fetchProfiles(this.profileRejectee)
    })
  }
  */
/*
  getProfileRequests() {
    this.getProfileRemoveReject()
  }

  getProfileRemoveReject() {
    this.relationshipService.listenProfileToRemoveReject().subscribe(res => {
      console.log(res)
      this.relationshipService.removeRejectRequest({_id: res.profile._id}).subscribe(remove => {
        console.log(remove)
      })
    })
  }
*/
}
