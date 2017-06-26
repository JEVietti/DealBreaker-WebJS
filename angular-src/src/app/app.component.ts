/* Used as main app component holding other modules and containers
 * for a nested display of dynamic SPAs to be displayed within
 * 
 * See the html, template url path for a better idea
 * As tags of components included in teh app.module.ts are available for inclusion.  
*/

import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app works!';
}
