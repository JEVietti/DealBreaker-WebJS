import { Component, OnInit, AfterContentInit, OnDestroy } from '@angular/core';
import { PendingRelationshipComponent } from '../../components/pending-relationship/pending-relationship.component'
import { SentRelationshipComponent } from '../../components/sent-relationship/sent-relationship.component'
import { ConfirmedRelationshipComponent } from '../../components/confirmed-relationship/confirmed-relationship.component'
import { RejectedRelationshipComponent } from '../../components/rejected-relationship/rejected-relationship.component'
import { RelationshipService } from '../../services/relationship.service'

import {Subscription} from 'rxjs/Subscription';

declare const $: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit, AfterContentInit, OnDestroy {

  // Subscriptions
  removeRequestSub: Subscription;
  removeRequestSubListener: Subscription;
  addRequestSub: Subscription;
  addRequestSubListener: Subscription;
  rejectRequestSub: Subscription;
  rejectRequestSubListener: Subscription;
  removeRejectSub: Subscription;
  removeRejectSubListener: Subscription;
  confirmRequestSub: Subscription;
  confirmRequestSubListener: Subscription;
  confirmRejectSub: Subscription;
  confirmRejectSubListener: Subscription; 
  rejectConfirmSub: Subscription;
  rejectConfirmSubListener: Subscription; 

  constructor(private relationshipService: RelationshipService) {}

  ngOnInit() {
    this.getProfileRequests()
    this.initMaterialize()
  }

  ngAfterContentInit() {

  }

  ngOnDestroy() {
    if (this.removeRequestSub) {
      this.removeRequestSub.unsubscribe()
    }
    if (this.removeRequestSubListener) {
      this.removeRequestSubListener.unsubscribe()
    }
    if (this.addRequestSub) {
      this.addRequestSub.unsubscribe()
    }
    if (this.addRequestSubListener) {
      this.addRequestSubListener.unsubscribe()
    }
    if (this.rejectRequestSub) {
      this.rejectRequestSub.unsubscribe()
    }
    if (this.rejectRequestSubListener) {
      this.rejectRequestSubListener.unsubscribe()
    }
    if (this.removeRejectSub) {
      this.removeRejectSub.unsubscribe()
    }
    if (this.removeRejectSubListener) {
      this.removeRejectSubListener.unsubscribe()
    }
    if (this.confirmRequestSub) {
      this.confirmRequestSub.unsubscribe()
    }
    if (this.confirmRequestSubListener) {
      this.confirmRequestSubListener.unsubscribe()
    }
    if (this.confirmRejectSub) {
      this.confirmRejectSub.unsubscribe()
    }
    if (this.confirmRejectSubListener) {
      this.confirmRejectSubListener.unsubscribe()
    }
    if (this.rejectConfirmSub) {
      this.confirmRejectSub.unsubscribe()
    }
    if (this.rejectConfirmSubListener) {
      this.rejectConfirmSubListener.unsubscribe()
    }
  }

  initMaterialize() {
    $(document).ready(function () {
      $('#reqSmallTab').on('click', () => {
        $('ul.tabs').tabs()
      })
      $('ul.tabs').tabs({
        onShow: function(tab) {
          $('#requestComp').tabs()
          $('#requestSmallComp').tabs()
        }
      });
    });
  }

  getProfileRequests() {
    this.getProfileAdd()
    this.getProfileRemoveRequest()
    this.getProfileReject()
    this.getProfileRemoveReject()
    this.getProfileConfirm()
    this.getProfileRejectConfirm()
  }

  getProfileRemoveRequest() {
    this.removeRequestSubListener = this.relationshipService.listenProfileToRemoveRequest().subscribe(res => {
      console.log(res)
      this.removeRequestSub = this.relationshipService.removePendingRequest({ _id: res.profile._id }).subscribe(remove => {
        console.log(remove)
      })
    })
  }

  getProfileAdd() {
    this.addRequestSubListener = this.relationshipService.listenProfileToAdd().subscribe(res => {
      console.log(res.profile._id)
      this.addRequestSub = this.relationshipService.sendPendingRequest({ _id: res.profile._id }).subscribe(request => {
        console.log(request)
      })
    })
  }


  getProfileReject() {
    this.rejectRequestSubListener = this.relationshipService.listenProfileToReject().subscribe(res => {
      console.log(res)
      this.rejectRequestSub = this.relationshipService.rejectRequest({ _id: res.profile._id }).subscribe(res => {
        console.log(res)
      })
    })
  }

  getProfileRemoveReject() {
    this.removeRejectSubListener = this.relationshipService.listenProfileToRemoveReject().subscribe(res => {
      console.log(res)
      this.removeRejectSub = this.relationshipService.removeRejectRequest({ _id: res.profile._id }).subscribe(remove => {
        console.log(remove)
      })
    })
  }

  getProfileConfirm() {
    this.confirmRequestSubListener = this.relationshipService.listenProfileToConfirm().subscribe(res => {
      console.log(res)
      this.confirmRequestSub = this.relationshipService.confirmRequest({_id: res.profile._id}).subscribe(confirm => {
        console.log(confirm)
      })
    })
  }

  getProfileRejectConfirm() {
    this.rejectConfirmSubListener = this.relationshipService.listenProfileToRejectConfirm().subscribe(res => {
      console.log(res)
      this.rejectConfirmSub = this.relationshipService.rejectConfirmRequest({ _id: res.profile._id }).subscribe(confirm => {
        console.log(confirm)
      })
    })
  }

}
