import { Component, OnInit } from '@angular/core';
import { PendingRelationshipComponent } from '../../components/pending-relationship/pending-relationship.component'
import { ConfirmedRelationshipComponent } from '../../components/confirmed-relationship/confirmed-relationship.component'
import { RejectedRelationshipComponent } from '../../components/rejected-relationship/rejected-relationship.component'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
