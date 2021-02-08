import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './console/login/login.component';
import {SignUpSetUpAccountComponent } from './console/sign-up-set-up-account/sign-up-set-up-account.component';
import { SignUpInviteTeamComponent } from './console/sign-up-invite-team/sign-up-invite-team.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'setup', component: SignUpSetUpAccountComponent },
  { path: 'invite', component: SignUpInviteTeamComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
