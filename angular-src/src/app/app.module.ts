/* Inclusion and Routing File for importing Created Components, Modules, and Routing
 * The Junction of declarations with small implementations for protecting and nesting
 * url paths as well as defining roles of imports.
 * 
*/

//Base package modules needed for implementation
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {RouterModule, Routes, ActivatedRoute, Params} from '@angular/router';

//User Created Components
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProfileComponent } from './components/profile/profile.component';
import { HomeComponent } from './components/home/home.component';
import { BrowseComponent } from './components/browse/browse.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { FooterComponent } from './components/footer/footer.component';
import { ProfileSetupComponent } from './components/profile-setup/profile-setup.component';

//user Created or Customized Services and Providers
import {ValidateService} from './services/validate.service';
import {AuthService} from './services/auth.service';
import {AuthGuard} from './guards/auth.guard';
import {FlashMessagesModule} from 'angular2-flash-messages';




//Application Routing in which the path -> component, 
//each path can be protected by an guard - AuthGuard: logged in status
//see guards/auth.guard.tcs for implementation
const appRoutes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'register', component: RegisterComponent}, 
  {path: 'login', component: LoginComponent}, 
  {path: 'profile', canActivate:[AuthGuard], children:[
    {path:'', component: ProfileComponent},
    { path:'setup', component: ProfileSetupComponent},    
    {path:':id', component: ProfileComponent}
  ]},
  {path: 'dashboard', component: DashboardComponent, canActivate:[AuthGuard]},
  {path: '404', component: NotFoundComponent},
  {path: '**', redirectTo: '/404'}
]

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    RegisterComponent,
    LoginComponent,
    DashboardComponent,
    ProfileComponent,
    HomeComponent,
    BrowseComponent,
    NotFoundComponent,
    FooterComponent,
    ProfileSetupComponent  
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes),
    FlashMessagesModule
    
  ],
  providers: [AuthService, ValidateService, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
