import { Component, OnInit, AfterContentInit, OnDestroy } from '@angular/core';
import { RelationshipService } from '../../services/relationship.service'
import { ProfileCardComponent } from '../../components/profile-card/profile-card.component';
import { Subscription } from 'rxjs/Subscription';
import {Router, ActivatedRoute, Params} from '@angular/router';

declare const $: any;

@Component({
  selector: 'app-pending-relationship',
  templateUrl: './pending-relationship.component.html',
  styleUrls: ['./pending-relationship.component.css']
})
export class PendingRelationshipComponent implements OnInit, AfterContentInit, OnDestroy {
  private profile: any;
  private profileRequests: Array<any>;
  private profileRequested: Array<any>;

  // Subscriptions

  constructor( private relationshipService: RelationshipService) {
    this.profileRequested = []
    this.profileRequests = []
  }

  // Lifecycle hooks
  ngOnInit() {
    this.fetchRequests()
    this.fetchRequesting()
  }

  ngAfterContentInit() {
      $(document).ready(function() {
        $('select').material_select();
      });
      this.getProfileRequests()
  }

  ngOnDestroy() {

  }

  fetchRequesting() {
    this.relationshipService.getRequestedList().subscribe(res => {
      console.log(res)
      if (res.profiles.requestor !== undefined) {
        res.profiles.requestor.forEach(element => {
          element.profile.status = 'requesting'
          this.profileRequested.push(element.profile);
        })
      }
    })
  }

  fetchRequests() {
    this.relationshipService.getRequestsList().subscribe(res => {
      console.log(res)
      if (res.profiles.requestee !== undefined) {
        res.profiles.requestee.forEach(element => {
          element.profile.status = 'pending'
          this.profileRequests.push(element.profile);
        })
      }
    })
  }

  getProfileRequests() {
    this.getProfileRemoveRequest()
    this.getProfileRemoveReject()
    this.getProfileReject()
    this.getProfileConfirm()
  }


  getProfileRemoveRequest() {
    this.relationshipService.listenProfileToRemoveRequest().subscribe(res => {
      console.log(res)
      this.relationshipService.removePendingRequest({_id: res.profile._id}).subscribe(remove => {
        console.log(remove)
      })
    })
  }

  getProfileReject() {
    this.relationshipService.listenProfileToReject().subscribe(res => {
      console.log(res)
      this.relationshipService.rejectRequest({_id: res.profile._id}).subscribe(reject => {
        console.log(reject)
      })
    })
  }

  getProfileRemoveReject() {
    this.relationshipService.listenProfileToRemoveReject().subscribe(res => {
      console.log(res)
      this.relationshipService.removeRejectRequest({_id: res.profile._id}).subscribe(remove => {
        console.log(remove)
      })
    })
  }

  getProfileConfirm() {
    this.relationshipService.listenProfileToConfirm().subscribe(res => {
      console.log(res)
      this.relationshipService.sendConfirmRequest({_id: res.profile._id}).subscribe(confim => {
        console.log(confirm)
      })
    })
  }



}
