import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {RouterModule, Routes, ActivatedRoute, Params} from '@angular/router';

import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProfileComponent } from './components/profile/profile.component';
import { HomeComponent } from './components/home/home.component';
import { BrowseComponent } from './components/browse/browse.component';

import {ValidateService} from './services/validate.service';
import {AuthService} from './services/auth.service';
import {AuthGuard} from './guards/auth.guard';
import {FlashMessagesModule} from 'angular2-flash-messages';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { FooterComponent } from './components/footer/footer.component';
import { ProfileSetupComponent } from './components/profile-setup/profile-setup.component';



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
