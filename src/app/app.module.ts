import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ActivitiesListComponent } from './Activities/activities-list/activities-list.component';
import { ActivitiesCardComponent } from './Activities/activities-card/activities-card.component';
import { TeamListComponent } from './Teams/team-list/team-list.component';
import { TeamCardComponent } from './Teams/team-card/team-card.component';
import { AddActivityCardComponent } from './add-card/add-activity-card.component';
import { SideMenuListComponent } from './Sidemenu/side-menu-list/side-menu-list.component';
import { SideMenuCardComponent } from './Sidemenu/side-menu-card/side-menu-card.component';
import { NavbarCardComponent } from './navbar/navbar-card/navbar-card.component';
import { Routes, RouterModule } from '@angular/router';
import { ProfileLogoComponent } from './Profile/profile-logo/profile-logo.component';
import { ProfileExpandListComponent } from './Profile/profile-expand-list/profile-expand-list.component';


const   routes: Routes = [
  { path: '', redirectTo: '/Team', pathMatch: 'full' },
  { path: 'Team', component: TeamListComponent },
  { path: 'Activities', component: ActivitiesListComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ActivitiesListComponent,
    ActivitiesCardComponent,
    TeamListComponent,
    TeamCardComponent,
    AddActivityCardComponent,
    SideMenuListComponent,
    SideMenuCardComponent,
    NavbarCardComponent,
    ProfileLogoComponent,
    ProfileExpandListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { 

}

