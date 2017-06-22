import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  constructor(
      private authService: AuthService,
       private router: Router
  ) { }

  ngOnInit() {
  }

  onLogoutClick(){
    this.authService.logout();
    this.router.navigate(['/']);
    return true;
  }


}
