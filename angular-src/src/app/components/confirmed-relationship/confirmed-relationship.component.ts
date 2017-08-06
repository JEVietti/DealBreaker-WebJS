import { Component, OnInit, AfterContentInit, OnDestroy } from '@angular/core';
import { RelationshipService } from '../../services/relationship.service'
import { Subscription } from "rxjs/Subscription";
import {Router, ActivatedRoute, Params} from '@angular/router';

declare const $: any;

@Component({
  selector: 'app-confirmed-relationship',
  templateUrl: './confirmed-relationship.component.html',
  styleUrls: ['./confirmed-relationship.component.css']
})
export class ConfirmedRelationshipComponent implements OnInit, AfterContentInit, OnDestroy {

  private profile: any;
  private relationships: Array<any>;

  constructor( private relationshipService: RelationshipService) {}

  ngOnInit() {
    this.fetchConfirmed()
  }

  ngAfterContentInit() {
      $(document).ready(function() {
        $('select').material_select();
      });
      //this.getProfileRequests()
  }

  ngOnDestroy() {

  }

  fetchConfirmed(){
    this.relationshipService.getConfirmed().subscribe(res => {

    })
  }

  /*
  getProfileRequests() {
    this.getProfileReject()
    this.getProfileConfirm()
  }


  getProfileReject(){
    this.relationshipService.listenProfileToReject().subscribe(res => {
      console.log(res)
      this.relationshipService.rejectRequest({_id: res.profile._id}).subscribe(res => {
        console.log(res)
      })
    })
  }

  getProfileConfirm(){
    this.relationshipService.listenProfileToConfirm().subscribe(res => {
      console.log(res)
      this.relationshipService.sendConfirmRequest(res.profile._id).subscribe(confirm => {
        console.log(confirm)
      })
    })
  }
  */


}
