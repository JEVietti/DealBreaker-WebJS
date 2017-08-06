import { Component, OnInit, AfterContentInit, OnDestroy } from '@angular/core';
import { PendingRelationshipComponent } from '../../components/pending-relationship/pending-relationship.component'
import { SentRelationshipComponent } from '../../components/sent-relationship/sent-relationship.component'
import { ConfirmedRelationshipComponent } from '../../components/confirmed-relationship/confirmed-relationship.component'
import { RejectedRelationshipComponent } from '../../components/rejected-relationship/rejected-relationship.component'
import { RelationshipService } from '../../services/relationship.service'
declare const $: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit, AfterContentInit {

  constructor(private relationshipService: RelationshipService) {}

  ngOnInit() {
    this.getProfileRequests()
    this.initMaterialize()
  }

  ngAfterContentInit() {

  }

  initMaterialize() {
    $(document).ready(function () {
      $('#reqSmallTab').on('click', () => {
        console.log('clicked')
        $('ul.tabs').tabs()
      })
      $('ul.tabs').tabs({
        onShow: function(tab) {
          console.log(tab)
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
  }

  getProfileRemoveRequest() {
    this.relationshipService.listenProfileToRemoveRequest().subscribe(res => {
      console.log(res)
      this.relationshipService.removePendingRequest({ _id: res.profile._id }).subscribe(remove => {
        console.log(remove)
      })
    })
  }

  getProfileAdd() {
    this.relationshipService.listenProfileToAdd().subscribe(res => {
      console.log(res.profile._id)
      this.relationshipService.sendPendingRequest({ _id: res.profile._id }).subscribe(request => {
        console.log(request)
      })
    })
  }


  getProfileReject() {
    this.relationshipService.listenProfileToReject().subscribe(res => {
      console.log(res)
      this.relationshipService.rejectRequest({ _id: res.profile._id }).subscribe(res => {
        console.log(res)
      })
    })
  }

  getProfileRemoveReject() {
    this.relationshipService.listenProfileToRemoveReject().subscribe(res => {
      console.log(res)
      this.relationshipService.removeRejectRequest({ _id: res.profile._id }).subscribe(remove => {
        console.log(remove)
      })
    })
  }

  getProfileConfirm() {
    this.relationshipService.listenProfileToConfirm().subscribe(res => {
      console.log(res)
      this.relationshipService.sendConfirmRequest(res.profile._id).subscribe(confirm => {
        console.log(confirm)
      })
    })
  }

}
