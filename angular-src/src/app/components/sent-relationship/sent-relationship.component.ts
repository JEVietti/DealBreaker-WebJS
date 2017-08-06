import { Component, OnInit, AfterContentInit, OnDestroy } from '@angular/core';
import { RelationshipService } from '../../services/relationship.service'
import { ProfileCardComponent } from '../../components/profile-card/profile-card.component';
import { Subscription } from 'rxjs/Subscription';
import { Router, ActivatedRoute, Params } from '@angular/router';

declare const $: any;

@Component({
  selector: 'app-sent-relationship',
  templateUrl: './sent-relationship.component.html',
  styleUrls: ['./sent-relationship.component.css']
})
export class SentRelationshipComponent implements OnInit {
  private profileRequested: Array<any>;

  constructor(private relationshipService: RelationshipService) {
    this.profileRequested = []

  }

  ngOnInit() {
    this.fetchRequesting()
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

}
