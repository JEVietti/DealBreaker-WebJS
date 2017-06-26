/* AuthGuard - Protectes Routes, found in app.component.ts : Main App
 *
 * If the User has been logged in according to AuthService - token found and not expired
 * If the User has been logged in then allow to the requested route otherwise redirect back to login
 *  
*/

import {Injectable} from '@angular/core';
import {Router, CanActivate} from '@angular/router';
import {AuthService} from '../services/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
    //Inject the AuthService for login check and Router for redirect
    constructor(
        private authService:AuthService,
        private router: Router
    )
    { }

    //Route Activation / Protection
    canActivate(){
        if(this.authService.loggedIn()){ ////Activate the Route for the User if logged In 
            return true;
        }
        this.router.navigate(['/login']);//otherwise redirect to Login Component
        return false;
    }
}