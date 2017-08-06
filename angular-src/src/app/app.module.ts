/* Inclusion and Routing File for importing Created Components, Modules, and Routing
 * The Junction of declarations with small implementations for protecting and nesting
 * url paths as well as defining roles of imports.
*/

//Base package modules needed for implementation
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
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
import { ImagesComponent } from './components/images/images.component';
import { BirthdateComponent } from './components/birthdate/birthdate.component';
import { AboutComponent } from './components/about/about.component';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
import { AccountComponent } from './components/account/account.component';
import { UpdateEmailComponent } from './components/update-email/update-email.component';
import { UpdatePasswordComponent } from './components/update-password/update-password.component';
import { ForgotComponent } from './components/forgot/forgot.component';
import { TermsComponent } from './components/terms/terms.component';
import {ProfileCardComponent} from './components/profile-card/profile-card.component';
import {ImageManageComponent} from './components/image-manage/image-manage.component'
import { PendingRelationshipComponent } from './components/pending-relationship/pending-relationship.component';
import { ConfirmedRelationshipComponent } from './components/confirmed-relationship/confirmed-relationship.component';
import { RejectedRelationshipComponent } from './components/rejected-relationship/rejected-relationship.component';

//User Created or Customized Services and Providers
import {ValidateService} from './services/validate.service';
import {AuthService} from './services/auth.service';
import {ImagesService} from './services/images.service';
import {ProfileService} from './services/profile.service';
import {AuthGuard} from './guards/auth.guard';
import { RegisterService } from './services/register.service';
import { BrowseService } from './services/browse.service';
import { RelationshipService } from './services/relationship.service';
import { ActionCardComponent } from './components/action-card/action-card.component';
import { SentRelationshipComponent } from './components/sent-relationship/sent-relationship.component';






/* Application Routing in which the path -> component, 
 * each path can be protected by an guard - AuthGuard: logged in status
 * see guards/auth.guard.tcs for implementation
*/
const appRoutes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'register', component: RegisterComponent}, 
  {path: 'login', component: LoginComponent}, 
  {path: 'browse', component: BrowseComponent}, 
  {path: 'profile', canActivate:[AuthGuard], children:[
    {path:'', component: ProfileComponent},
    { path:'setup', component: ProfileSetupComponent},
    { path:'images', component: ImagesComponent},            
    {path:':id', component: ProfileComponent}
  ]},
  {path: 'dashboard', component: DashboardComponent, canActivate:[AuthGuard]},
  {path: 'pending', component: PendingRelationshipComponent, canActivate:[AuthGuard]},
  {path: 'confirmed', component: PendingRelationshipComponent, canActivate:[AuthGuard]},
  {path: '404', component: NotFoundComponent},
  {path: 'privacy', component: PrivacyPolicyComponent},  
  {path: 'terms', component: TermsComponent},          
  {path: 'account', component: AccountComponent, canActivate:[AuthGuard]},     
  {path: 'forgot', children:[
    {path:':id', component: ForgotComponent}
  ]}, 
  {path: 'reset', children:[
    {path: '', component: UpdatePasswordComponent,canActivate:[AuthGuard]},
    {path:':token', component: UpdatePasswordComponent}
  ]},             
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
    ProfileSetupComponent,
    ImagesComponent,
    BirthdateComponent,
    AboutComponent,
    PrivacyPolicyComponent,
    AccountComponent,
    UpdateEmailComponent,
    UpdatePasswordComponent,
    ForgotComponent,
    TermsComponent,
    ProfileCardComponent,
    ImageManageComponent,
    RejectedRelationshipComponent,
    PendingRelationshipComponent,
    ConfirmedRelationshipComponent,
    ActionCardComponent,
    SentRelationshipComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes)
    
  ],
  providers: [
    AuthService, 
    ValidateService, 
    AuthGuard, 
    ImagesService, 
    ProfileService,
    RegisterService, 
    BrowseService,
    RelationshipService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
